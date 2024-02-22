import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MaxLength } from 'class-validator';

@InputType()
export class Login {
  @Field({ nullable: false })
  @IsEmail()
  @MaxLength(160)
  email: string;

  @Field(() => String, { nullable: false })
  @IsString()
  @MaxLength(160)
  password: string;
}
