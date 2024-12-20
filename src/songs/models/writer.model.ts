import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Song } from './song.model';

@ObjectType()
export class Writer {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => [Song])
  songs: Song[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
