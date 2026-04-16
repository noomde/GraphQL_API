import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

import { connectToDatabase } from './config/database.js';
import { limiter } from './config/rateLimiter.js';
import { createGamePlatformsLoader } from './loader/gamePlatformsLoader.js';
import { createScoresLoader } from './loader/scoresLoader.js';
import { authenticateJWT } from './middleware/auth.js';
import resolvers from './resolver/index.js';
import { typeDefs } from './schema/graphQL/index.js';

import StatisticsController from './controller/statisticsController.js';
import UsersController from './controller/usersController.js';
import ScoresController from './controller/scoresController.js';
import PlatformsController from './controller/platformsController.js';
import GamesController from './controller/gamesController.js';
import GamePlatformsController from './controller/gamePlatformsController.js';


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

      const controllers = {
      games: new GamesController(),
      gamesPlatforms: new GamePlatformsController(),
      platforms: new PlatformsController(),
      scores: new ScoresController(),
      statistics: new StatisticsController(),
      auth: new UsersController(),
      }

      try {
        const user = await authenticateJWT(req);
        return { user, loaders, controllers };
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
