import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Song } from './song.model';

@ObjectType()
export class Album {
  @Field(() => ID)
  id: string;

  @Field()
  title?: string;

  @Field({ nullable: true })
  releaseYear?: number;

  @Field(() => [Song])
  songs: Song[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
