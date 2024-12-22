import { Test, TestingModule } from '@nestjs/testing';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';
import { Song } from './graphql/models/song.model';
import { MonthFilterInput, PaginationInput } from './graphql/dto/song-filter.input';
import { SearchSongsInput } from './graphql/dto/search-song.input';

describe('SongsResolver', () => {
    let resolver: SongsResolver;
    let songsService: SongsService;

    const mockSong: Song = {
        id: '1',
        title: 'Test Song',
        releaseYear: 2020,
        artists: [{
            id: '1',
            name: 'Test Artist',
            createdAt: new Date(),
            updatedAt: new Date(),
            songs: []
        }],
        album: {
            id: '1',
            title: 'Test Album',
            createdAt: new Date(),
            updatedAt: new Date(),
            songs: []
        },
        writers: [],
        monthlyPlays: [],
        createdAt: new Date(),
        updatedAt: new Date()
    };

    const mockSongsService = {
        findSongsByYear: jest.fn(),
        findPopularSongs: jest.fn(),
        findPopularAlbums: jest.fn(),
        searchSongs: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SongsResolver,
                {
                    provide: SongsService,
                    useValue: mockSongsService,
                },
            ],
        }).compile();

        resolver = module.get<SongsResolver>(SongsResolver);
        songsService = module.get<SongsService>(SongsService);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    describe('songsByYear', () => {
        it('should return songs for a given year', async () => {
            const songs = [mockSong];
            mockSongsService.findSongsByYear.mockResolvedValue(songs);

            const result = await resolver.getSongsByYear(2020);

            expect(result).toEqual(songs);
            expect(mockSongsService.findSongsByYear).toHaveBeenCalledWith(2020);
        });
    });

    describe('searchSongs', () => {
        it('should return searched songs with pagination', async () => {
            const songs = [mockSong];
            const input: SearchSongsInput = {
                query: 'test',
                pagination: { limit: 10, offset: 0 }
            };

            mockSongsService.searchSongs.mockResolvedValue(songs);

            const result = await resolver.searchSongs(input);

            expect(result).toEqual(songs);
            expect(mockSongsService.searchSongs).toHaveBeenCalledWith(
                'test',
                10,
                0
            );
        });
    });

    describe('popularSongs', () => {
        it('should return popular songs with filter and pagination', async () => {
            const songs = [mockSong];
            const filter: MonthFilterInput = { month: 'June' };
            const pagination: PaginationInput = { limit: 10, offset: 0 };

            mockSongsService.findPopularSongs.mockResolvedValue(songs);

            const result = await resolver.getPopularSongs(filter, pagination);

            expect(result).toEqual(songs);
            expect(mockSongsService.findPopularSongs).toHaveBeenCalledWith(
                'June',
                10
            );
        });

        it('should return popular songs with default pagination when not provided', async () => {
            const songs = [mockSong];
            mockSongsService.findPopularSongs.mockResolvedValue(songs);

            const result = await resolver.getPopularSongs(null, null);

            expect(result).toEqual(songs);
            expect(mockSongsService.findPopularSongs).toHaveBeenCalledWith(
                undefined,
                10
            );
        });
    });
});