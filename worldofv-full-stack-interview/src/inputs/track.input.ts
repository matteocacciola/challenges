import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsNumber, Min } from 'class-validator';

@InputType()
export class GetTracksInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  artistName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  genreName?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @Field(() => Int, { nullable: false, defaultValue: 1 })
  @IsNumber()
  @Min(1)
  page: number;

  @Field(() => Int, { nullable: false, defaultValue: 10 })
  @IsNumber()
  @Min(1)
  pageSize: number;
}
