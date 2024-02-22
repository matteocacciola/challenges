import { InputType, Field } from '@nestjs/graphql';
import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsEnum,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Role } from '../../roles/roles.enums';

@InputType()
export class CreateUserInput {
  @Field({ nullable: false })
  @IsEmail()
  @MaxLength(160)
  email: string;

  @Field({ nullable: false })
  @IsString()
  @MaxLength(160)
  password: string;

  @Field(() => [String], { nullable: false })
  @IsArray()
  @IsEnum(Role, { each: true })
  @IsNotEmpty()
  roles: string[];
}
