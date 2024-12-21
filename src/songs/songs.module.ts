import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongsResolver } from './songs.resolver';
import { SongsService } from './songs.service';
import { ArtistEntity } from './entities/artist.entity';
import { WriterEntity } from './entities/writer.entity';
import { AlbumEntity } from './entities/album.entity';
import { SongEntity } from './entities/song.entity';
import { MonthlyPlayEntity } from './entities/monthly-play.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            ArtistEntity,
            WriterEntity,
            AlbumEntity,
            SongEntity,
            MonthlyPlayEntity,
        ]),
    ],
    providers: [SongsResolver, SongsService],
})
export class SongsModule { }