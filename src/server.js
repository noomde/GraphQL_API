import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';

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
    }),
  );
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        scriptSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        styleSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        imgSrc: [
          "'self'",
          'data:',
          'https://placehold.co',
          'https://secure.gravatar.com',
        ],
        fontSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        connectSrc: ["'self'", 'https://cdn.jsdelivr.net'],
        frameSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        frameAncestors: ["'none'"],
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
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    csrfPrevention: true,
    context: async ({ req }) => {
      try {
        const user = await authenticateJWT(req);
        return { 
          user,
          loaders: {
            gamePlatformsLoader: createGamePlatformsLoader()
          }
        };
      } catch {
        return { user: null };
      }
    },
  });

  // For running test cases with start-server-and-test
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
