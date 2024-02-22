import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AsyncLocalStorage } from 'async_hooks';
import { AuthService } from './auth.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly als: AsyncLocalStorage<any>,
    private readonly authService: AuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    await this.als.run({}, async () => {
      try {
        const user = await this.authService.getAuthenticatedUser(req);
        const store = { user };

        this.als.enterWith(store);
        next();
      } catch (error) {
        next(error);
      }
    });
  }
}
