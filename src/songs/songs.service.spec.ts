import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Repository } from 'typeorm';
import { SongsService } from './songs.service';
import { SongEntity } from './entities/song.entity';
import { AlbumEntity } from './entities/album.entity';
import { EntityMapper } from './utils/mapper';
import { Cache } from 'cache-manager';

describe('SongsService', () => {
    let service: SongsService;
    let songRepository: Repository<SongEntity>;
    let albumRepository: Repository<AlbumEntity>;
    let cacheManager: Cache;

    const mockSongEntity: SongEntity = {
        id: '1',
        title: 'Test Song',
        releaseYear: 2020,
        albumId: '1',
        artists: [{
            id: '1',
            name: 'Test Artist',
            createdAt: new Date('2022-01-01T00:00:00Z'),
            updatedAt: new Date('2022-01-01T00:00:00Z'),
            songs: []
        }],
        album: {
            id: '1',
            title: 'Test Album',
            createdAt: new Date('2022-01-01T00:00:00Z'),
            updatedAt: new Date('2022-01-01T00:00:00Z'),
            songs: []
        },
        writers: [{
            id: '1',
            name: 'Test Writer',
            createdAt: new Date('2022-01-01T00:00:00Z'),
            updatedAt: new Date('2022-01-01T00:00:00Z'),
            songs: []
        }],
        monthlyPlays: [{
            id: '1',
            songId: '1',
            month: 'June',
            playCount: 100,
            createdAt: new Date('2022-01-01T00:00:00Z'),
            updatedAt: new Date('2022-01-01T00:00:00Z'),
            song: null
        }],
        createdAt: new Date('2022-01-01T00:00:00Z'),
        updatedAt: new Date('2022-01-01T00:00:00Z')
    };

    const mockAlbumEntity: AlbumEntity = {
        id: '1',
        title: 'Test Album',
        songs: [],
        createdAt: new Date('2022-01-01T00:00:00Z'),
        updatedAt: new Date('2022-01-01T00:00:00Z')
    };

    const mockCacheManager = {
        get: jest.fn(),
        set: jest.fn(),
    };

    const createMockQueryBuilder = () => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        having: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockAlbumEntity])
    });

    const mockSongRepository = {
        find: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue(createMockQueryBuilder())
    };

    const mockAlbumRepository = {
        find: jest.fn(),
        createQueryBuilder: jest.fn().mockReturnValue(createMockQueryBuilder())
    };

    beforeEach(async () => {
        // Reset all mocks before each test
        jest.clearAllMocks();

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SongsService,
                {
                    provide: getRepositoryToken(SongEntity),
                    useValue: mockSongRepository,
                },
                {
                    provide: getRepositoryToken(AlbumEntity),
                    useValue: mockAlbumRepository,
                },
                {
                    provide: CACHE_MANAGER,
                    useValue: mockCacheManager,
                },
            ],
        }).compile();

        service = module.get<SongsService>(SongsService);
        songRepository = module.get<Repository<SongEntity>>(getRepositoryToken(SongEntity));
        albumRepository = module.get<Repository<AlbumEntity>>(getRepositoryToken(AlbumEntity));
        cacheManager = module.get(CACHE_MANAGER);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findSongsByYear', () => {
        it('should return cached songs if available', async () => {
            const cachedSongs = [EntityMapper.toSong(mockSongEntity)];
            mockCacheManager.get.mockResolvedValue(cachedSongs);

            const result = await service.findSongsByYear(2020);

            expect(result).toEqual(cachedSongs);
            expect(mockCacheManager.get).toHaveBeenCalledWith('songs_by_year_2020');
            expect(mockSongRepository.find).not.toHaveBeenCalled();
        });

        it('should fetch and cache songs if not in cache', async () => {
            mockCacheManager.get.mockResolvedValue(null);
            mockSongRepository.find.mockResolvedValue([mockSongEntity]);

            const result = await service.findSongsByYear(2020);

            expect(result).toEqual([EntityMapper.toSong(mockSongEntity)]);
            expect(mockSongRepository.find).toHaveBeenCalledWith({
                where: { releaseYear: 2020 },
                relations: ['artists', 'writers', 'album', 'monthlyPlays'],
            });
            expect(mockCacheManager.set).toHaveBeenCalled();
        });
    });

    describe('findPopularSongs', () => {
        it('should return popular songs for a specific month', async () => {
            mockCacheManager.get.mockResolvedValue(null);

            const result = await service.findPopularSongs('June', 10);
            expect(result).toEqual([{
                id: '1',
                title: 'Test Album',
                //   releaseYear: undefined,
                createdAt: new Date('2022-01-01T00:00:00Z'),
                updatedAt: new Date('2022-01-01T00:00:00Z')
            }
            ]);
            expect(mockSongRepository.createQueryBuilder).toHaveBeenCalled();
        });
    });

    describe('findPopularAlbums', () => {
        it('should return cached albums if available', async () => {
            const cachedAlbums = [EntityMapper.toAlbum(mockAlbumEntity)];
            mockCacheManager.get.mockResolvedValueOnce(cachedAlbums);

            const result = await service.findPopularAlbums('June', 10);

            expect(result).toEqual(cachedAlbums);
            expect(albumRepository.createQueryBuilder).not.toHaveBeenCalled();
            expect(mockCacheManager.get).toHaveBeenCalledTimes(1);
            expect(mockCacheManager.set).not.toHaveBeenCalled();
        });

        it('should return popular albums for a specific month when cache is empty', async () => {
            mockCacheManager.get.mockResolvedValueOnce(null);

            const firstQueryBuilder = createMockQueryBuilder();
            const secondQueryBuilder = createMockQueryBuilder();

            // Set up the repository to return different query builders
            mockAlbumRepository.createQueryBuilder
                .mockReturnValueOnce(firstQueryBuilder)
                .mockReturnValueOnce(secondQueryBuilder);

            const result = await service.findPopularAlbums('June', 10);

            expect(result).toBeDefined();
            expect(mockCacheManager.get).toHaveBeenCalledTimes(1);
            expect(mockCacheManager.set).toHaveBeenCalledTimes(1);
            expect(albumRepository.createQueryBuilder).toHaveBeenCalledTimes(2);
        });

        it('should return empty array when no albums found', async () => {
            mockCacheManager.get.mockResolvedValueOnce(null);

            const emptyQueryBuilder = createMockQueryBuilder();
            emptyQueryBuilder.getMany.mockResolvedValueOnce([]);
            mockAlbumRepository.createQueryBuilder.mockReturnValueOnce(emptyQueryBuilder);

            const result = await service.findPopularAlbums('June', 10);

            expect(result).toEqual([]);
            expect(mockCacheManager.get).toHaveBeenCalledTimes(1);
            expect(albumRepository.createQueryBuilder).toHaveBeenCalledTimes(1);
        });
    });
});