"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const products_1 = require("../../src/graphql/resolvers/products");
const context = {
    prisma: new client_1.PrismaClient(),
    pubsub: new graphql_subscriptions_1.PubSub(),
};
describe('Product Resolvers', () => {
    describe('Mutation: createProduct', () => {
        it('should create a new product and return the created product', async () => {
            const productId = 1;
            const mockedProduct = { name: 'TestProduct', price: 15.99 };
            jest
                .spyOn(context.prisma.product, 'create')
                .mockResolvedValue({ ...mockedProduct, id: productId });
            const result = await products_1.productResolvers.Mutation.createProduct(null, mockedProduct, context);
            expect(result).toEqual({ ...mockedProduct, id: productId.toString() });
            expect(context.prisma.product.create).toHaveBeenCalledWith({
                data: mockedProduct,
            });
        });
    });
});
//# sourceMappingURL=products.test.js.map