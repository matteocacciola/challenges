import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { CreateUserInput } from './graphql/inputs.types';
import { UserOutput } from './graphql/objects.types';
import { Roles } from '../auth/auth.decorator';
import { Role } from '../roles/roles.enums';
import { AppResolver as BaseResolver } from '../app.resolver';

@Resolver(() => UserOutput)
export class UsersResolver extends BaseResolver {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Mutation(() => UserOutput)
  @Roles(Role.ADMIN)
  async createUser(@Args('input') input: CreateUserInput): Promise<UserOutput> {
    const user = await this.usersService.createUser(input);
    return {
      id: user.id,
      email: user.email,
      roles: user.roles.map((role) => role.name),
    };
  }
}
