import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AsyncLocalStorage } from 'async_hooks';
import { TravelsService } from './travels.service';
import {
  CreateTravelInput,
  DeleteTravelInput,
  GetPaginatedTravelsInput,
} from './graphql/inputs.types';
import {
  DeletedTravelOutput,
  PaginatedTravelsOutput,
  TravelOutput,
} from './graphql/objects.types';
import { Public, Roles } from '../auth/auth.decorator';
import { Role } from '../roles/roles.enums';
import { AppResolver as BaseResolver } from '../app.resolver';

@Resolver(() => TravelOutput)
export class TravelsResolver extends BaseResolver {
  constructor(
    asyncLocalStorage: AsyncLocalStorage<any>,
    private readonly travelsService: TravelsService,
  ) {
    super(asyncLocalStorage);
  }

  @Mutation(() => TravelOutput)
  @Roles(Role.ADMIN)
  async createTravel(
    @Args('input') input: CreateTravelInput,
  ): Promise<TravelOutput> {
    return this.travelsService.createTravel(input);
  }

  @Mutation(() => DeletedTravelOutput)
  @Roles(Role.ADMIN)
  async deleteTravel(
    @Args('input') input: DeleteTravelInput,
  ): Promise<DeletedTravelOutput> {
    const isDeleted = await this.travelsService.deleteTravel(input);
    return { id: input.id, isDeleted };
  }

  @Query(() => PaginatedTravelsOutput)
  @Public()
  async getTravels(
    @Args('filter') input: GetPaginatedTravelsInput,
  ): Promise<PaginatedTravelsOutput> {
    const travels = await this.travelsService.getTravels(input);
    const count = await this.travelsService.getCountTravels();

    return {
      items: travels,
      totalItems: count,
    };
  }

  @Query(() => [TravelOutput])
  @Public()
  async getAllTravels(): Promise<TravelOutput[]> {
    return await this.travelsService.getAllTravels();
  }
}
