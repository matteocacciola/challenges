"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const users_1 = require("../../src/graphql/resolvers/users");
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
const context = {
    prisma: new client_1.PrismaClient(),
    pubsub: new graphql_subscriptions_1.PubSub(),
};
describe('User Resolvers', () => {
    describe('Mutation: login', () => {
        const userId = 123;
        const username = 'testuser';
        const password = 'password123';
        const hashedPassword = 'hashedpassword';
        const token = 'mockedtoken';
        beforeEach(() => {
            bcrypt_1.default.compare.mockReset();
            jsonwebtoken_1.default.sign.mockReset();
        });
        it('should return AuthPayload on successful login', async () => {
            const mockedUser = { id: userId, username, password: hashedPassword };
            jest
                .spyOn(context.prisma.user, 'findUnique')
                .mockResolvedValue(mockedUser);
            bcrypt_1.default.compare.mockResolvedValue(true);
            jsonwebtoken_1.default.sign.mockReturnValue(token);
            const result = await users_1.userResolvers.Mutation.login(null, { username, password }, context);
            const expected = { id: userId.toString(), username, restaurants: [] };
            expect(result.token).toBe(token);
            expect(result.user).toEqual(expected);
            expect(context.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { username },
                include: {
                    restaurants: true,
                },
            });
            expect(bcrypt_1.default.compare).toHaveBeenCalledWith(password, hashedPassword);
            expect(jsonwebtoken_1.default.sign).toHaveBeenCalledWith({ userId }, process.env.SECRET, {
                expiresIn: process.env.TOKEN_EXPIRE || '1h',
            });
        });
        it('should throw an error on invalid login', async () => {
            jest.spyOn(context.prisma.user, 'findUnique').mockResolvedValue(null);
            await expect(users_1.userResolvers.Mutation.login(null, { username, password: 'invalidpassword' }, context)).rejects.toThrow('Invalid username or password');
            expect(context.prisma.user.findUnique).toHaveBeenCalledWith({
                where: { username },
                include: {
                    restaurants: true,
                },
            });
        });
    });
    describe('Query: users', () => {
        it('should return a list of users', async () => {
            const mockedUsers = [
                { id: 123, username: 'user1', password: 'password1' },
                { id: 456, username: 'user2', password: 'password2' },
            ];
            jest
                .spyOn(context.prisma.user, 'findMany')
                .mockResolvedValue(mockedUsers);
            const result = await users_1.userResolvers.Query.users(context);
            const expected = mockedUsers.map((mockedUser) => {
                return {
                    id: mockedUser.id.toString(),
                    username: mockedUser.username,
                    restaurants: [],
                };
            });
            expect(result).toEqual(expected);
            expect(context.prisma.user.findMany).toHaveBeenCalled();
        });
    });
});
//# sourceMappingURL=users.test.js.map