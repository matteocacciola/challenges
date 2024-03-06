import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Login } from './graphql/inputs.types';
import { AuthService } from './auth.service';
import { Public } from './auth.decorator';
import { AccessTokenOutput } from './graphql/objects.types';
import { AppResolver as BaseResolver } from '../app.resolver';

@Resolver(() => AccessTokenOutput)
export class AuthResolver extends BaseResolver {
  constructor(private readonly authService: AuthService) {
    super();
  }

  @Mutation(() => AccessTokenOutput)
  @Public()
  async login(@Args('input') input: Login): Promise<AccessTokenOutput> {
    return this.authService.login(input);
  }
}
