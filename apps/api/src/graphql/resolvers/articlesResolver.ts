import { Db, Collection } from 'mongodb';
import { Article, ArticleContext } from '../../types';

export const Resolver = async (_: any, { page = 1, pageSize = 10 }: { page: number; pageSize: number }, { db }: { db: Db }) => {
    const articlesCollection: Collection<Article> = db.collection('articles');
    const articlesContextCollection: Collection<ArticleContext> = db.collection('article_contexts');
    const total = await articlesCollection.countDocuments();
    const articles = await articlesCollection
        .find()
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .toArray();

    const articlesWithTitles = await Promise.all(articles.map(async article => {
        const context = await articlesContextCollection
            .find({ article_id: article._id })
            .sort({ version: -1 })
            .limit(1)
            .next();

        return {
            id: article._id?.toHexString(),
            feed_id: article.feed_id.toHexString(),
            unique_id: article.unique_id,
            title: context?.title, // Fallback title
            link: article.link,
            pub_date: article.pub_date,
            iso_date: article.iso_date,
            content: context?.full_text, // Fetch content from articles_context
            image: article.image
        };
    }));
    return {
        articles: articlesWithTitles,
        page,
        pageSize,
        total
    };
}