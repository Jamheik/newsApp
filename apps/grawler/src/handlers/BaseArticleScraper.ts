import { chromium, Browser, Page, ElementHandle } from 'playwright';
import { ArticleContent } from '../types';
import * as Sentry from '@sentry/node';

export type BrowserFactory = () => Promise<Browser>;

export abstract class BaseArticleScraper {
    protected browserFactory: BrowserFactory;

    constructor(browserFactory?: BrowserFactory) {
        this.browserFactory = browserFactory || (() => chromium.launch({ headless: true }));
    }

    public async scrapeArticleContent(url: string): Promise<ArticleContent> {
        let browser: Browser | null = null;
        try {
            browser = await this.browserFactory();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

            const contentHandle = await this.extractContentContainer(page);
            const [fullText, images, videos] = contentHandle
                ? await Promise.all([
                    this.extractFullText(contentHandle),
                    this.extractImages(contentHandle),
                    this.extractVideos(contentHandle)
                ])
                : [await page.innerText('body'), [], []];

            const title = await this.extractTitle(page);

            if (!title) {
                throw new Error('Title not found');
            }

            return { title, fullText, attachments: { images, videos } };
        } catch (error) {
            Sentry.captureException(error);
            console.error('Error scraping article content for URL:', url, error);
            return { title: '', fullText: '', attachments: { images: [], videos: [] } };
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }

    protected async extractFullText(container: ElementHandle<Element>): Promise<string> {
        let text = await container.innerText();
        const marker = "Lue lisää kirjoittajalta";
        if (text.includes(marker)) {
            text = text.split(marker)[0].trim();
        }
        return text;
    }

    protected async extractImages(container: ElementHandle<Element>): Promise<string[]> {
        return container.$$eval('img', imgs => imgs.map(img => img.src));
    }

    protected async extractVideos(container: ElementHandle<Element>): Promise<string[]> {
        return container.$$eval('video', vids =>
            vids.map(video => {
                const src = video.getAttribute('src');
                if (src) return src;
                const source = video.querySelector('source');
                return source ? source.src : '';
            })
        );
    }

    /**
     * Abstract method to extract the content container.
     * Different implementations can define their own selectors.
     */
    protected abstract extractContentContainer(page: Page): Promise<ElementHandle<Element> | null>;

    /**
     * Abstract method to extract the article title.
     * Subclasses may use different selector strategies.
     */
    protected abstract extractTitle(page: Page): Promise<string | null>;
}
