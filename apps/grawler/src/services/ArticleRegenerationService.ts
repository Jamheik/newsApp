import { Db, Collection } from 'mongodb';
import pLimit from 'p-limit';
import * as Sentry from '@sentry/node';
import { Article } from '../types';
import { regenerateArticleContent } from './regenerateService';  


export class ArticleRegenerationService {
    private db: Db;
    private articlesCollection: Collection<Article>;
    private concurrencyLimit: number;

   
    constructor(db: Db, concurrencyLimit = 5) {
        this.db = db;
        this.articlesCollection = db.collection<Article>('articles');
        this.concurrencyLimit = concurrencyLimit;
    }

    
    public async regenerateAllArticles(): Promise<void> {
        try {
            const articles = await this.articlesCollection.find().toArray();

            const limit = pLimit(this.concurrencyLimit);

            const tasks = articles.map(article =>
                limit(async () => {
                    try {
                        await regenerateArticleContent(this.db, (article as any)._id.toString());
                    } catch (error) {
                        console.error(`Error regenerating article ${(article as any)._id}:`, error);
                    }
                })
            );

            await Promise.all(tasks);
            console.log('All articles have been regenerated.');
        } catch (error) {
            Sentry.captureException(error);
            console.error('Error in ArticleRegenerationService.regenerateAllArticles:', error);
        }
    }
}
