import { Query, Resolver } from '@nestjs/graphql';
import { AsyncLocalStorage } from 'async_hooks';
import { RolesService } from './roles.service';
import { RoleOutput } from './graphql/objects.types';
import { Public, Roles } from '../auth/auth.decorator';
import { Role } from './roles.enums';
import { AppResolver as BaseResolver } from '../app.resolver';
import { AccessControlService } from '../auth/access-control.service';

@Resolver(() => RoleOutput)
export class RolesResolver extends BaseResolver {
  constructor(
    asyncLocalStorage: AsyncLocalStorage<any>,
    private readonly rolesService: RolesService,
    private readonly accessControlService: AccessControlService,
  ) {
    super(asyncLocalStorage);
  }

  @Query(() => [RoleOutput])
  @Roles(Role.ADMIN)
  async getAllRoles(): Promise<RoleOutput[]> {
    return this.rolesService.all();
  }

  @Query(() => [RoleOutput])
  @Public()
  async getLoggedInUserRole(): Promise<RoleOutput[]> {
    let roles = this.getLoggedUser()?.roles;
    if (!roles) {
      const guestRole = await this.rolesService.findByName(Role.GUEST);
      roles = [guestRole];
    }

    return this.accessControlService.getHierarchy(roles).map((role) => ({
      name: role,
    }));
  }
}
