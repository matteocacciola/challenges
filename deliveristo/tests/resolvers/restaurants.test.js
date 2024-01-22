"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const restaurants_1 = require("../../src/graphql/resolvers/restaurants");
const context = {
    prisma: new client_1.PrismaClient(),
    pubsub: new graphql_subscriptions_1.PubSub(),
};
describe('Restaurant Resolvers', () => {
    describe('Query: restaurants', () => {
        it('should return restaurants of the specified user id', async () => {
            const userId = 1;
            const mockedRestaurants = { id: 1, name: 'TestRestaurant', userId };
            jest
                .spyOn(context.prisma.restaurant, 'findMany')
                .mockResolvedValue([mockedRestaurants]);
            const result = await restaurants_1.restaurantResolvers.Query.restaurants(null, { userId: userId.toString() }, context);
            expect(result).toEqual([
                { ...mockedRestaurants, id: mockedRestaurants.id.toString() },
            ]);
            expect(context.prisma.restaurant.findMany).toHaveBeenCalledWith({
                where: { userId },
            });
        });
    });
});
//# sourceMappingURL=restaurants.test.js.map