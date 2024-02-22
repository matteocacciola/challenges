import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleOutput {
  @Field()
  name: string;
}
