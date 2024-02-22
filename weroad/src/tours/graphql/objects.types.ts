import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class TourOutput {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field(() => Date)
  startingDate: Date;

  @Field(() => Date)
  endingDate: Date;

  @Field(() => Float)
  price: number;
}

@ObjectType()
export class PaginatedToursOutput {
  @Field(() => [TourOutput])
  items: TourOutput[];

  @Field(() => Int)
  totalItems: number;
}
