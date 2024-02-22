import { UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth/auth.guard';
import { AsyncLocalStorage } from 'async_hooks';
import { UserStore } from './auth/auth.models';

@UseGuards(AuthGuard)
export class AppResolver {
  constructor(private asyncLocalStorage: AsyncLocalStorage<any>) {}

  protected getLoggedUser(): UserStore | null {
    return this.asyncLocalStorage.getStore()?.user;
  }
}
