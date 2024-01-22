import { Restaurant } from '../@types/generated';
import { ResolverContext } from '../../types';
import { toGraphQLRestaurant } from '../transformers/restaurants';

export const restaurantResolvers = {
  Query: {
    restaurants: async (
      _,
      { userId }: { userId: string },
      context: ResolverContext,
    ): Promise<Restaurant[]> => {
      const result = await context.prisma.restaurant.findMany({
        where: { userId: parseInt(userId, 10) },
      });

      return result.map((restaurant) => toGraphQLRestaurant(restaurant));
    },
  },
};
