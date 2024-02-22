import { Field, Int, ObjectType } from '@nestjs/graphql';
import { TourOutput } from '../../tours/graphql/objects.types';

@ObjectType()
class MoodsOutput {
  @Field(() => Int)
  nature: number;

  @Field(() => Int)
  relax: number;

  @Field(() => Int)
  history: number;

  @Field(() => Int)
  culture: number;

  @Field(() => Int)
  party: number;
}

@ObjectType()
export class TravelOutput {
  @Field()
  id: string;

  @Field()
  isPublic: boolean;

  @Field()
  slug: string;

  @Field()
  name: string;

  @Field()
  description: string;

  @Field()
  numberOfDays: number;

  @Field()
  numberOfNights: number;

  @Field(() => MoodsOutput)
  moods: MoodsOutput;

  @Field(() => [TourOutput])
  tours: TourOutput[];
}

@ObjectType()
export class DeletedTravelOutput {
  @Field()
  id: string;

  @Field(() => Boolean)
  isDeleted: boolean;
}

@ObjectType()
export class PaginatedTravelsOutput {
  @Field(() => [TravelOutput])
  items: TravelOutput[];

  @Field(() => Int)
  totalItems: number;
}
