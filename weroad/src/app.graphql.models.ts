import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { OrderOrientation } from './app.types';

@InputType()
export class Pagination {
  @Field(() => Int, { nullable: true, defaultValue: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page: number;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  pageSize: number;
}

@InputType()
export class OrderBy {
  @Field({ nullable: true, defaultValue: 'id' })
  @IsOptional()
  column: string;

  @Field({ nullable: true, defaultValue: 'ASC' })
  @IsOptional()
  orientation?: OrderOrientation = 'ASC';
}
