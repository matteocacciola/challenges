import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  MaxLength,
  IsNumber,
  ValidateNested,
  IsInt,
  IsPositive,
  Max,
  Min,
  IsUUID,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Pagination } from '../../app.graphql.models';

@InputType()
class MoodsInput {
  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(100)
  nature: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(100)
  relax: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(100)
  history: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(100)
  culture: number;

  @Field(() => Int)
  @IsInt()
  @IsPositive()
  @Min(0)
  @Max(100)
  party: number;
}

@InputType()
export class CreateTravelInput {
  @Field({ nullable: false })
  @IsBoolean()
  isPublic: boolean;

  @Field({ nullable: false })
  @IsString()
  @MaxLength(255)
  slug: string;

  @Field({ nullable: false })
  @IsString()
  @MaxLength(255)
  name: string;

  @Field({ nullable: false })
  @IsString()
  description: string;

  @Field({ nullable: false })
  @IsNumber()
  numberOfDays: number;

  @Field(() => MoodsInput, { nullable: false })
  @ValidateNested()
  @Type(() => MoodsInput)
  moods: MoodsInput;
}

@InputType()
export class DeleteTravelInput {
  @Field({ nullable: false })
  @IsUUID()
  id: string;
}

@InputType()
export class GetPaginatedTravelsInput {
  @Field({ nullable: true })
  @IsOptional()
  @ValidateNested()
  pagination?: Pagination = {
    page: 1,
    pageSize: 10,
  };
}
