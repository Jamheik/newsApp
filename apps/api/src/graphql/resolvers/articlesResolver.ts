import { Db, Collection, ObjectId } from "mongodb";
import { Article, ArticleContext } from "../../types";

export const Resolver = async (
  _: any,
  {
    page = 1,
    pageSize = 10,
    categories,
    version,
    searchTerm,
  }: {
    page: number;
    pageSize: number;
    categories?: string[];
    version?: number;
    searchTerm?: string;
  },
  { db }: { db: Db }
) => {
  const articlesCollection: Collection<Article> = db.collection("articles");
  const articlesContextCollection: Collection<ArticleContext> =
    db.collection("article_contexts");

  // Find article IDs with the specific version if version is specified
  let articleIds: ObjectId[] = [];
  if (version !== undefined) {
    const contexts = await articlesContextCollection
      .find({ version })
      .toArray();

    articleIds = contexts.map((context) => context.article_id);

    // If no articles match the version, return empty result
    if (articleIds.length === 0) {
      return {
        articles: [],
        page,
        pageSize,
        total: 0,
      };
    }
  }

  const filter: { categories?: { $in: string[] }; _id?: { $in: ObjectId[] } } =
    {};
  if (categories && categories.length > 0) {
    filter.categories = { $in: categories };
  }

  if (version !== undefined && articleIds.length > 0) {
    filter._id = { $in: articleIds };
  }

  if (searchTerm) {
    const contexts = await articlesContextCollection
      .find({
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { full_text: { $regex: searchTerm, $options: "i" } },
        ],
      })
      .toArray();

    articleIds = contexts.map((context) => context.article_id);

    if (articleIds.length === 0) {
      return {
        articles: [],
        page,
        pageSize,
        total: 0,
      };
    }

    filter._id = { $in: articleIds };
  }

  const total = await articlesCollection.countDocuments(filter);
  const articles = await articlesCollection
    .find(filter)
    .sort({ iso_date: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .toArray();

  const articlesWithTitles = await Promise.all(
    articles.map(async (article) => {
      const contextQuery: { article_id: ObjectId; version?: number } = {
        article_id: article._id,
      };
      if (version !== undefined) {
        contextQuery.version = version;
      }

      const context = await articlesContextCollection
        .find(contextQuery)
        .sort({ version: version !== undefined ? 1 : -1 })
        .limit(1)
        .next();

      return {
        id: article._id?.toHexString(),
        feed_id: article.feed_id.toHexString(),
        unique_id: article.unique_id,
        title: context?.title || "Failed to fetch title",
        link: article.link,
        categories: article.categories,
        pub_date: article.pub_date,
        iso_date: article.iso_date,
        content: context?.full_text,
        image: article.image,
        version: context?.version,
      };
    })
  );

  return {
    articles: articlesWithTitles,
    page,
    pageSize,
    total,
  };
};
