import {
  Restaurant as PrismaRestaurant,
  User as PrismaUser,
} from '@prisma/client';

type MapUser = { restaurants: PrismaRestaurant[] } & PrismaUser;

export const toGraphQLUser = (user: MapUser) => {
  const { id, username, restaurants } = user;
  const tempUser = { id: id.toString(), username };

  return {
    ...tempUser,
    restaurants:
      restaurants?.map((restaurant) => ({
        ...restaurant,
        id: restaurant.id.toString(),
      })) || [],
  };
};
