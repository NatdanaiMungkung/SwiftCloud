import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Song } from './song.model';

@ObjectType()
export class MonthlyPlay {
    @Field(() => ID)
    id: string;

    @Field(() => Song)
    song: Song;

    @Field()
    month: string;

    @Field(() => Int)
    playCount: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}