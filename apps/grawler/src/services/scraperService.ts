import { chromium } from 'playwright';
import * as Sentry from '@sentry/node';

export async function scrapeArticleContent(url: string): Promise<{ title: string, fullText: string; attachments: { images: string[]; videos: string[] } }> {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15000 });
        const contentHandle = await page.$('[data-testid="main-lane-container"]');
        let title = '';
        let fullText = '';
        let images: string[] = [];
        let videos: string[] = [];
        if (contentHandle) {
            fullText = await contentHandle.innerText();
            if (fullText && fullText.includes("Lue lisää kirjoittajalta")) {
                fullText = fullText.split("Lue lisää kirjoittajalta")[0]!.trim();
            }
            images = await contentHandle.$$eval('img', imgs => imgs.map(img => img.src));
            videos = await contentHandle.$$eval('video', vids => {
                return vids.map(video => {
                    const src = video.getAttribute('src');
                    if (src) return src;
                    const source = video.querySelector('source');
                    return source ? source.src : '';
                });
            });
        } else {
            fullText = await page.innerText('body');
        }
        const titleHandle = await page.$('h1.article-headline--medium span');
        if (titleHandle) {
            title = await titleHandle.innerText();
        }
        await browser.close();
        return { title, fullText, attachments: { images, videos } };
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error scraping article content for URL', url, error);
        await browser.close();
        return { title: '', fullText: '', attachments: { images: [], videos: [] } };
    }
}
