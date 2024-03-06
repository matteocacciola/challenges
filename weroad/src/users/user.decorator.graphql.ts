import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserStore } from '../auth/auth.models';

export const LoggedUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserStore | null =>
    GqlExecutionContext.create(ctx).getContext().req.user,
);
