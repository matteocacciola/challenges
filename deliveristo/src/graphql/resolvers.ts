import { merge } from 'lodash';
import { userResolvers } from './resolvers/users';
import { restaurantResolvers } from './resolvers/restaurants';
import { productResolvers } from './resolvers/products';
import { cartResolvers } from './resolvers/carts';

export const resolvers = merge(
  userResolvers,
  restaurantResolvers,
  productResolvers,
  cartResolvers,
);
