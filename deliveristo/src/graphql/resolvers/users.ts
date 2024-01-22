import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthPayload, User } from '../@types/generated';
import { ResolverContext } from '../../types';
import { toGraphQLUser } from '../transformers/users';

export const userResolvers = {
  Query: {
    users: async (context: ResolverContext): Promise<User[]> => {
      const users = await context.prisma.user.findMany({
        include: {
          restaurants: true,
        },
      });
      return users.map((user) => toGraphQLUser(user));
    },
  },
  Mutation: {
    login: async (
      _,
      { username, password }: { username: string; password: string },
      context: ResolverContext,
    ): Promise<AuthPayload> => {
      const user = await context.prisma.user.findUnique({
        where: { username },
        include: {
          restaurants: true,
        },
      });

      if (!user) {
        throw new Error('Invalid username or password');
      }

      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        throw new Error('Invalid username or password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.SECRET, {
        expiresIn: process.env.TOKEN_EXPIRE || '1h',
      });

      return { token, user: toGraphQLUser(user) };
    },
  },
};
