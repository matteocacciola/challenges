import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { ResolverContext } from '../../src/types';
import { restaurantResolvers } from '../../src/graphql/resolvers/restaurants';

const context: ResolverContext = {
  prisma: new PrismaClient(),
  pubsub: new PubSub(),
};

describe('Restaurant Resolvers', () => {
  describe('Query: restaurants', () => {
    it('should return restaurants of the specified user id', async () => {
      const userId = 1;
      const mockedRestaurants = { id: 1, name: 'TestRestaurant', userId };
      jest
        .spyOn(context.prisma.restaurant, 'findMany')
        .mockResolvedValue([mockedRestaurants]);

      const result = await restaurantResolvers.Query.restaurants(
        null,
        { userId: userId.toString() },
        context,
      );

      expect(result).toEqual([
        { ...mockedRestaurants, id: mockedRestaurants.id.toString() },
      ]);
      expect(context.prisma.restaurant.findMany).toHaveBeenCalledWith({
        where: { userId },
      });
    });
  });
});
