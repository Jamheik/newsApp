import { Db, ObjectId, Collection } from 'mongodb';
import { Article, ArticleContext, ArticleAttachment } from '../../types';

export const Resolver = async (_: any, { id }: { id: string }, { db }: { db: Db }) => {
    const articlesCollection: Collection<Article> = db.collection('articles');
    const contextsCollection: Collection<ArticleContext> = db.collection('article_contexts');
    const attachmentsCollection: Collection<ArticleAttachment> = db.collection('article_attachments');
    
    const article = await articlesCollection.findOne({ _id: new ObjectId(id) });
    if (!article) return null;
    
    // Get the latest context version for this article
    const context = await contextsCollection
        .find({ article_id: article._id })
        .sort({ version: -1 })
        .limit(1)
        .next();
    
    const attachments = await attachmentsCollection.find({ article_id: article._id }).toArray();
    
    return {
        article: {
            id: article._id?.toHexString(),
            feed_id: article.feed_id.toHexString(),
            categories: article?.categories,
            unique_id: article.unique_id,
            link: article.link,
            pub_date: article.pub_date,
            iso_date: article.iso_date,
            image: article.image,
        },
        context: context
            ? {
                id: context._id?.toHexString(),
                article_id: context.article_id.toHexString(),
                language_code: context.language_code,
                title: context.title,
                full_text: context.full_text,
                version: context.version,
                created_at: context.created_at.toISOString(),
            }
            : null,
        attachments: attachments.map(att => ({
            id: att._id?.toHexString(),
            article_id: att.article_id.toHexString(),
            attachment_type: att.attachment_type,
            attachment_url: att.attachment_url,
            local_path: att.local_path,
            created_at: att.created_at.toISOString()
        }))
    };
}