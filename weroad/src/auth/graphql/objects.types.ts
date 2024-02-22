import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AccessTokenOutput {
  @Field({ nullable: false })
  accessToken: string;
}
