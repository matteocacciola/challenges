import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '@nestjs/apollo';
import { IS_PUBLIC_KEY, ROLE_KEY } from './auth.decorator';
import { Role } from '../roles/roles.enums';
import { AccessControlService } from './access-control.service';
import { UserStore } from './auth.models';
import { AsyncLocalStorage } from 'async_hooks';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private accessControlService: AccessControlService,
    private asyncLocalStorage: AsyncLocalStorage<any>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const user = await this.asyncLocalStorage.getStore()?.user;
    if (!user) {
      throw new UnauthorizedException();
    }

    const isAuthorized = await this.verifyRole(user, context);
    if (!isAuthorized) {
      throw new ForbiddenError('Forbidden resource');
    }
    return true;
  }

  private async verifyRole(
    user: UserStore,
    context: ExecutionContext,
  ): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    for (const role of requiredRoles) {
      const result = this.accessControlService.isAuthorized({
        requiredRole: role,
        currentRoles: user.roles,
      });

      if (result) {
        return true;
      }
    }

    return false;
  }
}
