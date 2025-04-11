import { Db, ObjectId, Collection, Sort } from 'mongodb';
import { Article, ArticleContext, ArticleAttachment } from '../../types';

export const Resolver = async (_: any, { id, version }: { id: string; version?: number }, { db }: { db: Db }) => {
    const articlesCollection: Collection<Article> = db.collection('articles');
    const contextsCollection: Collection<ArticleContext> = db.collection('article_contexts');

    const article = await articlesCollection.findOne({ _id: new ObjectId(id) });
    if (!article) return null;

    const contextQuery: { article_id: ObjectId; version?: number } = { article_id: article._id };
    
    if (version !== undefined) {
        contextQuery.version = version;
    }

    const contextSort: Sort = version !== undefined ? { version: 1 as const } : { version: -1 as const };
    
    const context = await contextsCollection
        .find(contextQuery)
        .sort(contextSort)
        .limit(1)
        .next();
    
    if (version !== undefined && !context) {
        return null;
    }

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
            : null
    };
}