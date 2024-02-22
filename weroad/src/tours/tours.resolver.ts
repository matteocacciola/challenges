import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { AsyncLocalStorage } from 'async_hooks';
import { ToursService } from './tours.service';
import {
  CreateTourInput,
  UpdateTourInput,
  GetPaginatedToursInput,
  GetTourInput,
} from './graphql/inputs.types';
import { PaginatedToursOutput, TourOutput } from './graphql/objects.types';
import { Public, Roles } from '../auth/auth.decorator';
import { Role } from '../roles/roles.enums';
import { AppResolver as BaseResolver } from '../app.resolver';

@Resolver(() => TourOutput)
export class ToursResolver extends BaseResolver {
  constructor(
    asyncLocalStorage: AsyncLocalStorage<any>,
    private readonly toursService: ToursService,
  ) {
    super(asyncLocalStorage);
  }

  @Mutation(() => TourOutput)
  @Roles(Role.ADMIN)
  async createTour(@Args('input') input: CreateTourInput): Promise<TourOutput> {
    return this.toursService.createTour(input);
  }

  @Mutation(() => TourOutput)
  @Roles(Role.EDITOR)
  async updateTour(@Args('input') input: UpdateTourInput): Promise<TourOutput> {
    return this.toursService.updateTour(input);
  }

  @Query(() => TourOutput)
  @Roles(Role.EDITOR)
  async getTour(@Args('filter') input: GetTourInput): Promise<TourOutput> {
    return this.toursService.getTour(input);
  }

  @Query(() => PaginatedToursOutput)
  @Public()
  async getTours(
    @Args('filter') input: GetPaginatedToursInput,
  ): Promise<PaginatedToursOutput> {
    const items = await this.toursService.getTours(input);
    const count = await this.toursService.getToursCount(input);

    return {
      items,
      totalItems: count,
    };
  }
}
