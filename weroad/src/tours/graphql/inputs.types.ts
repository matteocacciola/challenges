import { InputType, Field, Float } from '@nestjs/graphql';
import {
  IsDateString,
  IsOptional,
  IsPositive,
  IsUUID,
  Validate,
  ValidateNested,
} from 'class-validator';
import { OrderBy, Pagination } from '../../app.graphql.models';

@InputType()
export class CreateTourInput {
  @Field()
  @IsUUID()
  travelId: string;

  @Field()
  name: string;

  @Field(() => Date)
  @IsDateString()
  @Validate(
    (value: number, args: { object: { endingDate: number } }) =>
      value < args.object.endingDate,
    {
      message: 'Starting date must be before ending date',
    },
  )
  startingDate: Date;

  @Field(() => Date)
  @IsDateString()
  endingDate: Date;

  @Field(() => Float)
  @IsPositive()
  price: number;

  @Field({ nullable: true })
  @IsOptional()
  currency?: string;
}

@InputType()
export class UpdateTourInput {
  @Field()
  @IsUUID()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  name?: string;

  @Field({ nullable: true })
  @IsDateString()
  @Validate(
    (value: number, args: { object: { endingDate: number } }) =>
      value < args.object.endingDate,
    {
      message: 'Starting date must be before ending date',
    },
  )
  @IsOptional()
  startingDate?: Date;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endingDate?: Date;

  @Field(() => Float, { nullable: true })
  @IsPositive()
  @IsOptional()
  price?: number;

  @Field({ nullable: true })
  @IsOptional()
  currency?: string;
}

@InputType()
export class GetTourInput {
  @Field()
  @IsUUID()
  id: string;
}

@InputType()
class GetPaginatedToursInputFilters {
  @Field({ nullable: true })
  @Validate(
    (value: number, args: { object: { priceTo: number } }) =>
      value <= args.object.priceTo,
    {
      message: 'Price from must be less than or equal to price to',
    },
  )
  @IsOptional()
  @IsPositive()
  priceFrom?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsPositive()
  priceTo?: number;

  @Field({ nullable: true })
  @IsDateString()
  @Validate(
    (value: number, args: { object: { endingDate: number } }) =>
      value < args.object.endingDate,
    {
      message: 'Starting date must be before ending date',
    },
  )
  @IsOptional()
  startingDate?: Date;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  endingDate?: Date;
}

@InputType()
export class GetPaginatedToursInput {
  @Field()
  slug: string;

  @Field({ nullable: true })
  @ValidateNested()
  @IsOptional()
  filters?: GetPaginatedToursInputFilters;

  @Field({ nullable: true })
  @ValidateNested()
  @IsOptional()
  pagination?: Pagination = {
    page: 1,
    pageSize: 10,
  };

  @Field({ nullable: true })
  @ValidateNested()
  @IsOptional()
  order?: OrderBy = {
    column: 'price',
    orientation: 'ASC',
  };
}
