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

    /**
     * This query returns a list of popular songs based on the optional filter and pagination inputs.
     *
     * @param {MonthFilterInput} filter - An optional input that allows filtering the songs by a specific month.
     * @param {PaginationInput} pagination - An optional input that allows setting the limit and offset for the results.
     *
     * @returns {Promise<Song[]>} A promise that resolves to an array of Song objects.
     */
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

    /**
     * This query returns a list of popular albums based on the optional filter and pagination inputs.
     *
     * @param {MonthFilterInput} filter - An optional input that allows filtering the albums by a specific month.
     * @param {PaginationInput} pagination - An optional input that allows setting the limit and offset for the results.
     *
     * @returns {Promise<Album[]>} A promise that resolves to an array of Album objects.
     */
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

    /**
     * This query returns a list of songs that match a search query.
     *
     * @param {SearchSongsInput} input - An input that contains the search query and optional pagination parameters.
     * @param {string} input.query - The search query string.
     * @param {number} input.pagination.limit - The maximum number of songs to return in the results. Defaults to 10 if not specified.
     * @param {number} input.pagination.offset - The number of songs to skip before returning results. Defaults to 0 if not specified.
     *
     * @returns {Promise<Song[]>} A promise that resolves to an array of Song objects that match the search query.
     */
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