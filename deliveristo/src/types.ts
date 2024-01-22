import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';

export type ResolverContext = {
  prisma: PrismaClient;
  pubsub: PubSub;
};
