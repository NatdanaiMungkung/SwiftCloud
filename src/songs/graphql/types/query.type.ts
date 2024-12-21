import { ObjectType, Field } from '@nestjs/graphql';
import { Song } from '../models/song.model';
import { Album } from '../models/album.model';

@ObjectType()
export class Query {
    @Field(() => [Song])
    songsByYear: Song[];

    @Field(() => [Song])
    popularSongs: Song[];

    @Field(() => [Album])
    popularAlbums: Album[];

    @Field(() => [Song])
    searchSongs: Song[];
}