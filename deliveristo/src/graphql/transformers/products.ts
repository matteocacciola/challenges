import { Product as PrismaProduct } from '.prisma/client';
import { Product } from '../@types/generated';

export const toGraphQLProduct = (product: PrismaProduct): Product => ({
  ...product,
  id: product.id.toString(),
});
