import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { ResolverContext } from '../../src/types';
import { cartResolvers } from '../../src/graphql/resolvers/carts';
import { CartStatus } from '../../src/enums';

const context: ResolverContext = {
  prisma: new PrismaClient(),
  pubsub: new PubSub(),
};

describe('Cart Resolvers', () => {
  describe('Mutation: addToCart', () => {
    const mockedCart = { id: 1, restaurantId: 1, status: CartStatus.Active };
    const mockedProduct = { productId: '1', restaurantId: '1' };

    jest.spyOn(context.prisma.cart, 'upsert').mockResolvedValue(mockedCart);
    jest.spyOn(context.pubsub, 'publish').mockResolvedValue(null);

    it('should add a product to an existing cart and return the updated cart', async () => {
      jest
        .spyOn(context.prisma.cart, 'findUnique')
        .mockResolvedValue(mockedCart);

      const result = await cartResolvers.Mutation.addToCart(
        null,
        mockedProduct,
        context,
      );
      const expected = {
        ...mockedCart,
        id: mockedCart.id.toString(),
        restaurant: undefined,
        products: [],
      };

      expect(result).toEqual(expected);
      expect(context.prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { restaurantId: 1, status: CartStatus.Active },
      });
      expect(context.prisma.cart.upsert).toHaveBeenCalled();
      expect(context.pubsub.publish).toHaveBeenCalledWith('CART_UPDATED_1', {
        cartUpdated: {
          id: parseInt(expected.id, 10),
          restaurantId: expected.restaurantId,
          status: expected.status,
        },
      });
    });

    it('should add a product to a new cart and return the updated cart', async () => {
      jest.spyOn(context.prisma.cart, 'findUnique').mockResolvedValue(null);

      const result = await cartResolvers.Mutation.addToCart(
        null,
        mockedProduct,
        context,
      );
      const expected = {
        ...mockedCart,
        id: mockedCart.id.toString(),
        restaurant: undefined,
        products: [],
      };
      expect(result).toEqual(expected);

      expect(context.prisma.cart.findUnique).toHaveBeenCalledWith({
        where: { restaurantId: 1, status: CartStatus.Active },
      });
      expect(context.prisma.cart.upsert).toHaveBeenCalled();
      expect(context.pubsub.publish).toHaveBeenCalledWith('CART_UPDATED_1', {
        cartUpdated: {
          id: parseInt(expected.id, 10),
          restaurantId: expected.restaurantId,
          status: expected.status,
        },
      });
    });
  });

  describe('Subscription: cartUpdated', () => {
    it('should subscribe to cart updates for a specific cartId', async () => {
      jest.spyOn(context.pubsub, 'asyncIterator');
      cartResolvers.Subscription.cartUpdated.subscribe(
        null,
        { cartId: 1 },
        context,
      );
      expect(context.pubsub.asyncIterator).toHaveBeenCalledWith(
        'CART_UPDATED_1',
      );
    });
  });
});
