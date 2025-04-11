import * as Sentry from '@sentry/node';
import { connectToDb } from './db/mongo';
import { fetchAndStoreFeed } from './services/feedService';
import { enrichArticlesWithFullContent } from './services/articleService';
import { regenerateArticleContent } from './services/regenerateService';
import { Db } from 'mongodb';

import dotenv from 'dotenv';
import { FeedService } from './services/news/FeedService';
import pLimit from 'p-limit';

import { DefaultArticleScraper } from './services/DefaultArticleScraper'; // Adjust the import path as needed
import { ArticleContextService } from './services/ArticleContextService';
import { ArticleRegenerationService } from './services/news/ArticleRegenerationService';

dotenv.config();

async function runFeedScraper(db: Db, concurrencyLimit = 3): Promise<void> {
    const feedUrls: string[] = process.env.FEEDURLS?.split('|') ?? [];
    if (feedUrls.length === 0) {
        throw new Error('No feed URLs provided');
    }

    try {
        const feedService = new FeedService(db);

        const feedUrlLimiter = pLimit(concurrencyLimit);

        await Promise.all(
            feedUrls.map(feedUrl =>
                feedUrlLimiter(() => feedService.fetchAndStoreFeed(feedUrl))
            )
        );

        console.log('All feeds processed successfully.');
    } catch (error) {
        console.error('Error processing feed:', error);
    }
}

async function runContentScraper(db: Db, concurrencyLimit = 5): Promise<void> {
    try {
        console.log('Starting content scraper job...');
        const articleContextService = new ArticleContextService(db, concurrencyLimit); // Adjust concurrency limit as needed.

        // Process all articles to scrape their content and store article contexts.
        await articleContextService.processAllArticles();
        console.log('Article contexts processing complete.');
    } catch (error) {
        console.error('Error processing feed:', error);
    }
}

async function runRegenerationService(db: Db, concurrencyLimit = 5): Promise<void> {
    try {
        const regenerationService = new ArticleRegenerationService(db, concurrencyLimit);

        await regenerationService.regenerateAllArticles();
        console.log('Regeneration complete.');

    } catch (error) {
        console.error('Error processing feed:', error);
    }
}

(async () => {
    try {
        const db = await connectToDb();

        console.log('Starting scheduled scraper job');
        await runFeedScraper(db);
        await runContentScraper(db);

        // await runRegenerationService(db, 20);
        
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error in scraper point:', error);
    } finally {
        console.log('Finishing scheduled scraper job');
    }
})();