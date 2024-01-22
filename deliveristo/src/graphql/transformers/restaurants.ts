import { Restaurant as PrismaRestaurant } from '.prisma/client';
import { Restaurant } from '../@types/generated';

export const toGraphQLRestaurant = (
  restaurant: PrismaRestaurant,
): Restaurant => ({
  ...restaurant,
  id: restaurant.id.toString(),
});
