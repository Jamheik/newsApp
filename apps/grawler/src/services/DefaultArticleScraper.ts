import { ElementHandle, Page } from "playwright";
import { BaseArticleScraper } from "../handlers/BaseArticleScraper";

export class DefaultArticleScraper extends BaseArticleScraper {
    protected async extractContentContainer(page: Page): Promise<ElementHandle<Element> | null> {
        let container = await page.$('[data-testid="main-lane-container"]');
        if (!container) {
            container = await page.$('section.yle__article__content');
        }
        
        return container;
    }

    protected async extractTitle(page: Page): Promise<string | null> {
        const selectors = ['h1.article-headline--medium span', 'h1.yle__article__heading--1'];
        for (const selector of selectors) {
            const handle = await page.$(selector);
            if (handle) {
                const title = await handle.innerText();
                if (title) return title;
            }
        }
        return null;
    }
}
