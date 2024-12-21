import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Artist } from './artist.model';
import { Writer } from './writer.model';
import { Album } from './album.model';
import { MonthlyPlay } from './monthly-play.model';


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

  @Field(() => Int, { nullable: true })
  releaseYear?: number;

  @Field(() => [MonthlyPlay])
  monthlyPlays: MonthlyPlay[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}