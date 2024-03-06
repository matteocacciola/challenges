import { Query, Resolver } from '@nestjs/graphql';
import { RolesService } from './roles.service';
import { RoleOutput } from './graphql/objects.types';
import { Public, Roles } from '../auth/auth.decorator';
import { Role } from './roles.enums';
import { AppResolver as BaseResolver } from '../app.resolver';
import { AccessControlService } from '../auth/access-control.service';
import { LoggedUser } from '../users/user.decorator.graphql';
import { UserStore } from '../auth/auth.models';

@Resolver(() => RoleOutput)
export class RolesResolver extends BaseResolver {
  constructor(
    private readonly rolesService: RolesService,
    private readonly accessControlService: AccessControlService,
  ) {
    super();
  }

  @Query(() => [RoleOutput])
  @Roles(Role.ADMIN)
  async getAllRoles(): Promise<RoleOutput[]> {
    return this.rolesService.all();
  }

  @Query(() => [RoleOutput])
  @Public()
  async getLoggedInUserRole(
    @LoggedUser() user: UserStore | null,
  ): Promise<RoleOutput[]> {
    let roles = user ? user.roles : null;
    if (!roles) {
      const guestRole = await this.rolesService.findByName(Role.GUEST);
      roles = [guestRole];
    }

    return this.accessControlService.getHierarchy(roles).map((role) => ({
      name: role,
    }));
  }
}
