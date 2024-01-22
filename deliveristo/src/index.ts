import cors from 'cors';
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { resolvers } from './graphql/resolvers';
import { typeDefs } from './graphql/schema';
import { ResolverContext } from './types';
import { verifyTokenMiddleware } from './middleware/authMiddleware';

const schema = makeExecutableSchema({ typeDefs, resolvers });

const app = express();
const httpServer = createServer(app);

const prisma = new PrismaClient();
const pubsub = new PubSub();

// Create our WebSocket server using the HTTP server we just set up.
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/subscriptions',
});
const serverCleanup = useServer({ schema }, wsServer);

const server = new ApolloServer({
  schema,
  context: (): ResolverContext => ({ prisma, pubsub }),
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

app.use((req, res, next) => {
  if (req.path !== '/graphql' || req.body?.operationName === 'login') {
    next();
    return;
  }

  verifyTokenMiddleware(req, res, next);
});

app.use('/graphql', cors<cors.CorsRequest>(), express.json());

server.start().then(() => {
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  const URL = process.env.HOST || 'http://localhost';

  httpServer.listen(PORT, () => {
    console.log(`Server running at ${URL}:${PORT}/graphql`);
  });
});
