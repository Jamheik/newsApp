import { chromium, Browser, Page, ElementHandle } from 'playwright';
import * as Sentry from '@sentry/node';

export interface ArticleContent {
    title: string;
    fullText: string;
    attachments: {
        images: string[];
        videos: string[];
    };
}


export type BrowserFactory = () => Promise<Browser>;

export class ArticleScraper {
    private browserFactory: BrowserFactory;

   
    constructor(browserFactory?: BrowserFactory) {
        this.browserFactory = browserFactory || (() => chromium.launch({ headless: true }));
    }

    public async scrapeArticleContent(url: string): Promise<ArticleContent> {
        let browser: Browser | null = null;
        try {
            browser = await this.browserFactory();
            const page = await browser.newPage();
            await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });

            const contentHandle = await this.getContentContainer(page);
            const [fullText, images, videos] = contentHandle
                ? await Promise.all([
                    this.extractFullText(contentHandle),
                    this.extractImages(contentHandle),
                    this.extractVideos(contentHandle)
                ])
                : [await page.innerText('body'), [], []];

            const title = await this.extractTitle(page);

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

    private async getContentContainer(page: Page): Promise<ElementHandle<Element> | null> {
        let container = await page.$('[data-testid="main-lane-container"]');
        if (!container) {
            container = await page.$('section.yle__article__content');
        }
        // Additional selectors can be added here as needed.
        return container;
    }

    
    private async extractFullText(container: ElementHandle<Element>): Promise<string> {
        let text = await container.innerText();
        const marker = "Lue lisää kirjoittajalta";
        if (text && text.includes(marker)) {
            text = text.split(marker)[0].trim();
        }
        return text;
    }

    
    private async extractImages(container: ElementHandle<Element>): Promise<string[]> {
        return await container.$$eval('img', imgs => imgs.map(img => img.src));
    }

    
    private async extractVideos(container: ElementHandle<Element>): Promise<string[]> {
        return await container.$$eval('video', vids => {
            return vids.map(video => {
                const src = video.getAttribute('src');
                if (src) return src;
                const source = video.querySelector('source');
                return source ? source.src : '';
            });
        });
    }

    private async extractTitle(page: Page): Promise<string> {
        let title = '';
        const selectors = ['h1.article-headline--medium span', 'h1.yle__article__heading--1'];

        for (const selector of selectors) {
            const titleHandle = await page.$(selector);
            if (titleHandle) {
                title = await titleHandle.innerText();
                if (title) break;
            }
        }
        return title;
    }
}
