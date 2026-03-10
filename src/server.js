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
dotenv.config();

try {
  await connectToDatabase(process.env.DATABASE_URL);
  console.log('Connected to the database successfully');

  const app = express();
  const port = process.env.PORT || 3001;

  app.use(
    helmet({
      crossOriginOpenerPolicy: { policy: 'same-origin' },
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
  );

  app.use(cors());
  app.use(express.json());

  app.set('trust proxy', 1);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageLocalDefault()],
    context: async ({ req }) => {
      try {
        const user = await authenticateJWT(req);
        return { user };
      } catch {
        return { user: null };
      }
    },
  });

  // For running test cases with start-server-and-test
  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });

  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
} catch (error) {
  console.error('Failed to connect to the database:', error);
  process.exitCode = 1;
}
