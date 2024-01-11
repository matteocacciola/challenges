import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { Artist } from './artist.model';

@ObjectType()
export class Track {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  duration: number;

  @Field()
  genre: string;

  @Field(() => Artist)
  artist?: Artist;
}
