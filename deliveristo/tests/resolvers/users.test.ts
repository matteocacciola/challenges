import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { PubSub } from 'graphql-subscriptions';
import { ResolverContext } from '../../src/types';
import { userResolvers } from '../../src/graphql/resolvers/users';
import { AuthPayload } from '../../src/graphql/@types/generated';

jest.mock('bcrypt');
jest.mock('jsonwebtoken');

const context: ResolverContext = {
  prisma: new PrismaClient(),
  pubsub: new PubSub(),
};

describe('User Resolvers', () => {
  describe('Mutation: login', () => {
    const userId = 123;
    const username = 'testuser';
    const password = 'password123';
    const hashedPassword = 'hashedpassword';
    const token = 'mockedtoken';

    beforeEach(() => {
      // Reset mock calls for each test
      (bcrypt.compare as jest.Mock).mockReset();
      (jwt.sign as jest.Mock).mockReset();
    });

    it('should return AuthPayload on successful login', async () => {
      const mockedUser = { id: userId, username, password: hashedPassword };
      jest
        .spyOn(context.prisma.user, 'findUnique')
        .mockResolvedValue(mockedUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result: AuthPayload = await userResolvers.Mutation.login(
        null,
        { username, password },
        context as any,
      );
      const expected = { id: userId.toString(), username, restaurants: [] };

      expect(result.token).toBe(token);
      expect(result.user).toEqual(expected);
      expect(context.prisma.user.findUnique).toHaveBeenCalledWith({
        where: { username },
        include: {
          restaurants: true,
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(jwt.sign).toHaveBeenCalledWith({ userId }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE || '1h',
      });
    });

    it('should throw an error on invalid login', async () => {
      jest.spyOn(context.prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        userResolvers.Mutation.login(
          null,
          { username, password: 'invalidpassword' },
          context as any,
        ),
      ).rejects.toThrow('Invalid username or password');

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
      // Mocking Prisma response
      const mockedUsers = [
        { id: 123, username: 'user1', password: 'password1' },
        { id: 456, username: 'user2', password: 'password2' },
      ];
      jest
        .spyOn(context.prisma.user, 'findMany')
        .mockResolvedValue(mockedUsers);

      const result = await userResolvers.Query.users(context as any);
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
