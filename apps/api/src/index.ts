import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import * as Sentry from '@sentry/node';
import { connectToDb } from './db/mongo';

import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import dotenv from 'dotenv';

(async () => {

    await dotenv.config();

    try {
        Sentry.init({
            dsn: process.env.SENTRY_DSN,
            environment: process.env.NODE_ENV || 'development',
        });

        const db = await connectToDb();

        const server = new ApolloServer({
            typeDefs,
            resolvers,
        });

        const { url } = await startStandaloneServer(server, {
            context: async () => ({ db }),
            listen: { port: Number(process.env.PORT) || 4000 },
        });

        console.log(`🚀 Server ready at: ${url}`);
    } catch (error) {
        Sentry.captureException(error);
        console.error('Error in main entry point:', error);
    }
})();