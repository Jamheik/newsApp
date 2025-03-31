import { Resolver as articleResolver } from './resolvers/articleResolver';
import { Resolver as articlesResolver } from './resolvers/articlesResolver';
import { Resolver as feedResolver } from './resolvers/feedResolver';
import { Resolver as weatherResolver } from './resolvers/weatherResolver';
import { Resolver as categoriesResolver } from './resolvers/categoriesResolver';

export const resolvers = {
    Query: {
        feeds: feedResolver,
        articles: articlesResolver,
        article: articleResolver,
        weather: weatherResolver,
        categories: categoriesResolver
    }
};
