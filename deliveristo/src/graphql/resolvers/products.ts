import { ResolverContext } from '../../types';
import { Product } from '../@types/generated';
import { toGraphQLProduct } from '../transformers/products';

export const productResolvers = {
  Mutation: {
    createProduct: async (
      _,
      { name, price }: { name: string; price: number },
      context: ResolverContext,
    ): Promise<Product> => {
      const product = await context.prisma.product.create({
        data: {
          name,
          price,
        },
      });

      return toGraphQLProduct(product);
    },
  },
};
