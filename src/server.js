import { ApolloServer } from 'apollo-server-express';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { typeDefs } from './schema/graphQL/index.js';
import resolvers from './resolvers/index.js';
import { connectToDatabase } from './config/database.js';
import { authenticateJWT } from './middleware/auth.js';
import { limiter } from './config/rateLimiter.js';
import { createGamePlatformsLoader } from './loaders/gamePlatformsLoader.js';
import { createScoresLoader } from './loaders/scoresLoader.js';
dotenv.config();

try {
  await connectToDatabase(process.env.DATABASE_URL);
  console.log('Connected to the database successfully');

  const app = express();
  const port = process.env.PORT || 3001;

  // safety measures
  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },

      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],

          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://embeddable-sandbox.cdn.apollographql.com',
          ],

          styleSrc: [
            "'self'",
            "'unsafe-inline'",
            'https://cdn.jsdelivr.net',
            'https://fonts.googleapis.com',
            'https://apollo-server-landing-page.cdn.apollographql.com',
          ],

          fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],

          imgSrc: [
            "'self'",
            'data:',
            'https://placehold.co',
            'https://secure.gravatar.com',
            'https://apollo-server-landing-page.cdn.apollographql.com',
          ],

          connectSrc: [
            "'self'",
            'https://cdn.jsdelivr.net',
            'https://apollo-server-landing-page.cdn.apollographql.com',
            'https://embeddable-sandbox.cdn.apollographql.com',
            'https://graphql.api.apollographql.com',
          ],

          frameSrc: ["'self'", 'https://studio.apollographql.com'],

          objectSrc: ["'none'"],
          baseUri: ["'self'"],
          frameAncestors: ["'none'"],
        },
      },
    }),
  );

  app.use(cors());
  app.use(express.json());
  app.use(limiter);
  app.set('trust proxy', 1);

  // define apollo server
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageProductionDefault({ footer: false })
        : ApolloServerPluginLandingPageLocalDefault({ footer: false }),
    ],
    csrfPrevention: true,
    context: async ({ req }) => {
      const loaders = {
        gamePlatformsLoader: createGamePlatformsLoader(),
        scoresLoader: createScoresLoader(),
      };

      try {
        const user = await authenticateJWT(req);
        return { user, loaders };
      } catch {
        return { user: null, loaders };
      }
    },
  });

  // For health check (seeing if the server is running)
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  // start the server
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error('Failed to connect to the database:', error);
  process.exitCode = 1;
}
