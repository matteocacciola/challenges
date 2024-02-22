import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserOutput {
  @Field({ nullable: false })
  id: string;

  @Field({ nullable: false })
  email: string;

  @Field(() => [String], { nullable: false })
  roles: string[];
}
