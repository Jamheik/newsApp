import { Db, ObjectId, Collection } from 'mongodb';
import { DefaultArticleScraper } from './DefaultArticleScraper';
import pLimit from 'p-limit';
import * as Sentry from '@sentry/node';
import { Article, ArticleContext } from '../types';


export class ArticleContextService {
    private db: Db;
    private articlesCollection: Collection<Article>;
    private articleContextsCollection: Collection<ArticleContext>;
    private scraper: DefaultArticleScraper;
    private concurrencyLimit: number;

    constructor(db: Db, concurrencyLimit = 5) {
        this.db = db;
        this.articlesCollection = db.collection<Article>('articles');
        this.articleContextsCollection = db.collection<ArticleContext>('article_contexts');
        this.scraper = new DefaultArticleScraper();
        this.concurrencyLimit = concurrencyLimit;
    }


    public async processAllArticles(): Promise<void> {
        try {
            const articles = await this.articlesCollection.find().toArray();

            const limit = pLimit(this.concurrencyLimit);
            const tasks = articles.map(article =>
                limit(() => this.processArticle(article))
            );

            await Promise.all(tasks);
            console.log('All articles processed.');
        } catch (error) {
            Sentry.captureException(error);
            console.error('Error processing articles:', error);
        }
    }

   
    private async processArticle(article: Article): Promise<void> {
        try {
            const existingContext = await this.articleContextsCollection.findOne({ article_id: article._id });
            if (existingContext) {
                return;
            }

            const content = await this.scraper.scrapeArticleContent(article.link);

            const articleContext: ArticleContext = {
                article_id: article._id as ObjectId,
                language_code: 'fi',
                title: content.title,
                full_text: content.fullText,
                version: 1,
                created_at: new Date()
            };

            await this.articleContextsCollection.insertOne(articleContext);
            console.log(`Article context saved for article ${article._id}`);
        } catch (error) {
            Sentry.captureException(error);
            console.error(`Error processing article ${article._id}:`, error);
        }
    }
}
