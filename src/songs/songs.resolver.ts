import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { SongsService } from './songs.service';
import { Song } from './graphql/models/song.model';
import { Album } from './graphql/models/album.model';
import { MonthFilterInput, PaginationInput } from './graphql/dto/song-filter.input';
import { SearchSongsInput } from './graphql/dto/search-song.input';

@Resolver(() => Song)
export class SongsResolver {
    constructor(private songsService: SongsService) { }

    @Query(() => [Song], { name: 'songsByYear', nullable: true })
    async getSongsByYear(
        @Args('year', { type: () => Int }) year: number,
    ): Promise<Song[]> {
        return await this.songsService.findSongsByYear(year);
    }

    @Query(() => [Song], { name: 'popularSongs', nullable: true })
    async getPopularSongs(
        @Args('filter', { nullable: true }) filter?: MonthFilterInput,
        @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    ): Promise<Song[]> {
        return this.songsService.findPopularSongs(
            filter?.month,
            pagination?.limit ?? 10,
        );
    }

    @Query(() => [Album], { name: 'popularAlbums', nullable: true })
    async getPopularAlbums(
        @Args('filter', { nullable: true }) filter?: MonthFilterInput,
        @Args('pagination', { nullable: true }) pagination?: PaginationInput,
    ): Promise<Album[]> {
        return this.songsService.findPopularAlbums(
            filter?.month,
            pagination?.limit ?? 10,
        );
    }

    @Query(() => [Song], { name: 'searchSongs', nullable: true })
    async searchSongs(
        @Args('input') input: SearchSongsInput,
    ): Promise<Song[]> {
        return this.songsService.searchSongs(
            input.query,
            input.pagination?.limit ?? 10,
            input.pagination?.offset ?? 0,
        );
    }
}