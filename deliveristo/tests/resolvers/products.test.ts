import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { ResolverContext } from '../../src/types';
import { productResolvers } from '../../src/graphql/resolvers/products';

const context: ResolverContext = {
  prisma: new PrismaClient(),
  pubsub: new PubSub(),
};

describe('Product Resolvers', () => {
  describe('Mutation: createProduct', () => {
    it('should create a new product and return the created product', async () => {
      const productId = 1;
      const mockedProduct = { name: 'TestProduct', price: 15.99 };
      jest
        .spyOn(context.prisma.product, 'create')
        .mockResolvedValue({ ...mockedProduct, id: productId });

      const result = await productResolvers.Mutation.createProduct(
        null,
        mockedProduct,
        context,
      );

      expect(result).toEqual({ ...mockedProduct, id: productId.toString() });
      expect(context.prisma.product.create).toHaveBeenCalledWith({
        data: mockedProduct,
      });
    });
  });
});
