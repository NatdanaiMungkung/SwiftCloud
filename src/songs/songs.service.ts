import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { SongEntity } from './entities/song.entity';
import { AlbumEntity } from './entities/album.entity';
import { EntityMapper } from './utils/mapper';
import { Song } from './graphql/models/song.model';
import { Album } from './graphql/models/album.model';

@Injectable()
export class SongsService {
    constructor(
        @InjectRepository(SongEntity)
        private songsRepository: Repository<SongEntity>,
        @InjectRepository(AlbumEntity)
        private albumsRepository: Repository<AlbumEntity>,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) { }

    /**
     * Finds all songs that were released in the specified year.
     *
     * @param {number} year - The year to filter songs by.
     * @return {Promise<Song[]>} A promise that resolves to an array of Song objects.
     */
    async findSongsByYear(year: number): Promise<Song[]> {
        const cacheKey = `songs_by_year_${year}`;
        const cached = await this.cacheManager.get<Song[]>(cacheKey);
        if (cached) return cached;

        const songs = await this.songsRepository.find({
            where: { releaseYear: year },
            relations: ['artists', 'writers', 'album', 'monthlyPlays'],
        });
        const mappedSongs = songs.map(song => EntityMapper.toSong(song));
        await this.cacheManager.set(cacheKey, mappedSongs);
        return mappedSongs;
    }

    /**
     * Finds the most popular songs based on a given month.
     * If no month is provided, it will assume the current month.
     *
     * @param {string} month - The month to filter songs by.
     * @param {number} limit - The number of songs to return. Defaults to 10.
     * @return {Promise<Song[]>} A promise that resolves to an array of Song objects.
     */
    async findPopularSongs(month?: string, limit: number = 10): Promise<Song[]> {
        const cacheKey = `popular_songs_${month}_${limit}`;
        const cached = await this.cacheManager.get<Song[]>(cacheKey);
        if (cached) return cached;

        const query = this.songsRepository
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.monthlyPlays', 'monthlyPlay')
            .leftJoinAndSelect('song.artists', 'artist')
            .leftJoinAndSelect('song.album', 'album');

        if (month) {
            query.where('monthlyPlay.month = :month', { month });
        }

        const songs = await query
            .orderBy('monthlyPlay.playCount', 'DESC')
            .take(limit)
            .getMany();
        const mappedSongs = songs.map(song => EntityMapper.toSong(song));
        await this.cacheManager.set(cacheKey, mappedSongs);
        return mappedSongs;
    }

    async findPopularAlbums(month?: string, limit: number = 10): Promise<Album[]> {
        const cacheKey = `popular_albums_${month}_${limit}`;
        const cached = await this.cacheManager.get<Album[]>(cacheKey);
        if (cached) return cached;

        const query = this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.songs', 'song')
            .leftJoinAndSelect('song.monthlyPlays', 'monthlyPlay')
            .leftJoinAndSelect('song.artists', 'artist')
            .leftJoinAndSelect('song.writers', 'writer');

        if (month) {
            query.andWhere('monthlyPlay.month = :month', { month });
        }

        // First get total plays per album with songs count verification
        const albumsWithPlays = await query
            .select([
                'album.id',
                'album.title',
                'album.createdAt',
                'album.updatedAt'
            ])
            .addSelect('COUNT(DISTINCT song.id)', 'songsCount')
            .addSelect('COALESCE(SUM(monthlyPlay.playCount), 0)', 'totalPlays')
            .groupBy('album.id, album.title, album.createdAt, album.updatedAt')
            .having('COUNT(DISTINCT song.id) > 0') // Only albums with songs
            .take(limit)
            .getMany();

        // Then fetch complete data for selected albums
        const albumIds = albumsWithPlays.map(album => album.id);

        if (albumIds.length === 0) {
            return [];
        }

        const detailedAlbums = await this.albumsRepository
            .createQueryBuilder('album')
            .leftJoinAndSelect('album.songs', 'song')
            .leftJoinAndSelect('song.monthlyPlays', 'monthlyPlay')
            .leftJoinAndSelect('song.artists', 'artist')
            .leftJoinAndSelect('song.writers', 'writer')
            .where('album.id IN (:...albumIds)', { albumIds })
            .orderBy('song.title', 'ASC')  // Add consistent ordering
            .getMany();

        // Verify and map the results
        const sortedAlbums = albumIds
            .map(id => detailedAlbums.find(album => album.id === id))
            .filter((album): album is AlbumEntity => {
                if (!album || !Array.isArray(album.songs)) {
                    console.error(`Invalid album data found for id in ${albumIds}`);
                    return false;
                }
                return true;
            });

        const mapped = sortedAlbums.map(album => EntityMapper.toAlbum(album));
        await this.cacheManager.set(cacheKey, mapped);

        return mapped;
    }

    /**
     * Searches for songs by a given query string.
     *
     * This method performs a case-insensitive search on the song titles and artist names.
     * The results are paginated using the provided limit and offset.
     *
     * @param {string} query - The search query string.
     * @param {number} limit - The maximum number of songs to return. Defaults to 10.
     * @param {number} offset - The number of songs to skip before starting to return results. Defaults to 0.
     * @return {Promise<Song[]>} A promise that resolves to an array of Song objects.
     */
    async searchSongs(
        query: string,
        limit: number = 10,
        offset: number = 0,
    ): Promise<Song[]> {
        const cacheKey = `search_songs_${query}_${limit}_${offset}`;
        const cached = await this.cacheManager.get<Song[]>(cacheKey);
        if (cached) return cached;

        const songs = await this.songsRepository
            .createQueryBuilder('song')
            .leftJoinAndSelect('song.artists', 'artist')
            .leftJoinAndSelect('song.album', 'album')
            .where('LOWER(song.title) LIKE LOWER(:query)', { query: `%${query}%` })
            .orWhere('LOWER(artist.name) LIKE LOWER(:query)', { query: `%${query}%` })
            .take(limit)
            .skip(offset)
            .getMany();

        const mappedSongs = songs.map(song => EntityMapper.toSong(song));
        await this.cacheManager.set(cacheKey, mappedSongs);
        return mappedSongs;
    }
}