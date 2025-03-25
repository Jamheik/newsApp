import * as Sentry from '@sentry/node';
import { connectToDb } from './db/mongo';
import { fetchAndStoreFeed } from './services/feedService';
import { enrichArticlesWithFullContent } from './services/articleService';
import { regenerateArticleContent } from './services/regenerateService';
import { Db } from 'mongodb';

import dotenv from 'dotenv';

dotenv.config();

async function runScraper(db: Db): Promise<void> {
    const feedUrls: string[] = process.env.FEEDURLS?.split('|') ?? [];

    if (feedUrls.length === 0) {
        throw new Error('No feed URLs provided');
    }

    for (const feedUrl of feedUrls) {
        await fetchAndStoreFeed(db, feedUrl);
    }
    await enrichArticlesWithFullContent(db);
}


(async () => {
    try {
        const db = await connectToDb();

        console.log('Starting scheduled scraper job');

        await runScraper(db);

        // await regenerateArticleContent(db, '67bdd8be7078e242a94b2ef4');

    } catch (error) {
        Sentry.captureException(error);
        console.error('Error in scraper point:', error);
    }
})();