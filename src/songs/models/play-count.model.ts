import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Song } from './song.model';

@ObjectType()
export class PlayCount {
  @Field(() => ID)
  id: string;

  @Field(() => Song)
  song: Song;

  @Field()
  month: string;

  @Field()
  year: number;

  @Field()
  playCount: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
