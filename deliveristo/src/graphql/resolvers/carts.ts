import { Cart } from '../@types/generated';
import { ResolverContext } from '../../types';
import { CartStatus } from '../../enums';
import { toGraphQLCart } from '../transformers/carts';

export const cartResolvers = {
  Mutation: {
    addToCart: async (
      _,
      { productId, restaurantId }: { productId: string; restaurantId?: string },
      context: ResolverContext,
    ): Promise<Cart> => {
      const existingCart = await context.prisma.cart.findUnique({
        where: {
          restaurantId: parseInt(restaurantId, 10),
          status: CartStatus.Active,
        },
      });

      const updatedCart = await context.prisma.cart.upsert({
        where: { id: existingCart?.id },
        update: {
          products: {
            connect: { id: parseInt(productId, 10) },
          },
        },
        create: {
          restaurantId: (
            await context.prisma.restaurant.findUnique({
              where: { id: parseInt(restaurantId, 10) },
            })
          )?.id,
          products: {
            connect: { id: parseInt(productId, 10) },
          },
          status: CartStatus.Active,
        },
        include: {
          products: true,
        },
      });

      // Notify subscribers about the updated cart
      await context.pubsub.publish(`CART_UPDATED_${updatedCart.id}`, {
        cartUpdated: updatedCart,
      });

      return toGraphQLCart(updatedCart);
    },
  },
  Subscription: {
    cartUpdated: {
      subscribe: (
        _,
        { cartId }: { cartId: number },
        { pubsub }: ResolverContext,
      ) => pubsub.asyncIterator(`CART_UPDATED_${cartId}`),
    },
  },
};
