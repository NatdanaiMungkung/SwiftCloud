import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Artist } from './artist.model';
import { Writer } from './writer.model';
import { Album } from './album.model';
import { PlayCount } from './play-count.model';

@ObjectType()
export class Song {
  @Field(() => ID)
  id: string;

  @Field()
  title: string;

  @Field(() => [Artist])
  artists: Artist[];

  @Field(() => [Writer])
  writers: Writer[];

  @Field(() => Album, { nullable: true })
  album?: Album;

  @Field(() => [PlayCount])
  playCounts: PlayCount[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
