import * as Sentry from '@sentry/node';
import { ObjectId, Db } from 'mongodb';
import { ArticleContext, ArticleAttachment, Article } from '../types';
import { scrapeArticleContent } from './scraperService';

export async function enrichArticlesWithFullContent(db: Db): Promise<void> {
    try {
        const articlesCollection = (db as Db).collection<Article>('articles');
        const contextsCollection = (db as Db).collection<ArticleContext>('article_contexts');
        const attachmentsCollection = (db as Db).collection<ArticleAttachment>('article_attachments');
        const articles = await articlesCollection.find().toArray();
        for (const article of articles) {
            const contextExists = await contextsCollection.findOne({ article_id: article._id });
            if (contextExists) continue;
            console.log(`Scraping full article content for: ${article.link}`);
            const content = await scrapeArticleContent(article.link);
            const articleContext: ArticleContext = {
                article_id: article._id as ObjectId,
                language_code: 'fi',
                title: content.title, // Added title field
                full_text: content.fullText,
                version: 1,
                created_at: new Date()
            };
            await contextsCollection.insertOne(articleContext);
            for (const img of content.attachments.images) {
                const attachment: ArticleAttachment = {
                    article_id: article._id as ObjectId,
                    attachment_type: 'image',
                    attachment_url: img,
                    created_at: new Date()
                };
                await attachmentsCollection.insertOne(attachment);
            }
            for (const vid of content.attachments.videos) {
                const attachment: ArticleAttachment = {
                    article_id: article._id as ObjectId,
                    attachment_type: 'video',
                    attachment_url: vid,
                    created_at: new Date()
                };
                await attachmentsCollection.insertOne(attachment);
            }
        }
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error in enrichArticlesWithFullContent:', error);
    }
}
