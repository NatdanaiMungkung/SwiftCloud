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
        // console.log('mappedSongs', mappedSongs)
        return mappedSongs;
    }

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
            .leftJoinAndSelect('song.monthlyPlays', 'monthlyPlay');

        if (month) {
            query.where('monthlyPlay.month = :month', { month });
        }

        const albums = await query
            .addSelect('SUM(monthlyPlay.playCount)', 'totalPlays')
            .groupBy('album.id')
            .orderBy('totalPlays', 'DESC')
            .take(limit)
            .getMany();
        const mappedAlbums = albums.map(album => EntityMapper.toAlbum(album));
        await this.cacheManager.set(cacheKey, mappedAlbums);
        return mappedAlbums;
    }

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