import {
  Cart as PrismaCart,
  Product as PrismaProduct,
  Restaurant as PrismaRestaurant,
} from '@prisma/client';
import { Cart } from '../@types/generated';

type MapCart = {
  products: PrismaProduct[];
  restaurant?: PrismaRestaurant;
} & PrismaCart;

export const toGraphQLCart = (cart: MapCart): Cart => {
  const { id, products, restaurant } = cart;
  const tempCart = { ...cart, id: id.toString() };

  return {
    ...tempCart,
    restaurant: restaurant
      ? {
          ...restaurant,
          id: restaurant?.id.toString(),
        }
      : undefined,
    products:
      products?.map((product) => ({
        ...product,
        id: product.id.toString(),
      })) || [],
  };
};
