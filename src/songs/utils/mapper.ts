import { SongEntity } from '../entities/song.entity';
import { ArtistEntity } from '../entities/artist.entity';
import { WriterEntity } from '../entities/writer.entity';
import { AlbumEntity } from '../entities/album.entity';
import { MonthlyPlayEntity } from '../entities/monthly-play.entity';
import { Song } from '../graphql/models/song.model';
import { Artist } from '../graphql/models/artist.model';
import { Writer } from '../graphql/models/writer.model';
import { Album } from '../graphql/models/album.model';
import { MonthlyPlay } from '../graphql/models/monthly-play.model';

export class EntityMapper {
    static toSong(entity: SongEntity): Song {
        const song = new Song();
        song.id = entity.id;
        song.title = entity.title;
        song.releaseYear = entity.releaseYear;
        song.createdAt = entity.createdAt;
        song.updatedAt = entity.updatedAt;

        if (entity.artists) {
            song.artists = entity.artists.map(artist => this.toArtist(artist));
        }
        if (entity.writers) {
            song.writers = entity.writers.map(writer => this.toWriter(writer));
        }
        if (entity.album) {
            song.album = this.toAlbum(entity.album);
        }
        if (entity.monthlyPlays) {
            song.monthlyPlays = entity.monthlyPlays.map(play => this.toMonthlyPlay(play));
        }
        return song;
    }

    static toArtist(entity: ArtistEntity): Artist {
        const artist = new Artist();
        artist.id = entity.id;
        artist.name = entity.name;
        artist.createdAt = entity.createdAt;
        artist.updatedAt = entity.updatedAt;
        return artist;
    }

    static toWriter(entity: WriterEntity): Writer {
        const writer = new Writer();
        writer.id = entity.id;
        writer.name = entity.name;
        writer.createdAt = entity.createdAt;
        writer.updatedAt = entity.updatedAt;
        return writer;
    }

    static toAlbum(entity: AlbumEntity): Album {
        const album = new Album();
        album.id = entity.id;
        album.title = entity.title;
        album.createdAt = entity.createdAt;
        album.updatedAt = entity.updatedAt;
        return album;
    }

    static toMonthlyPlay(entity: MonthlyPlayEntity): MonthlyPlay {
        const monthlyPlay = new MonthlyPlay();
        monthlyPlay.id = entity.id;
        monthlyPlay.month = entity.month;
        monthlyPlay.playCount = entity.playCount;
        monthlyPlay.createdAt = entity.createdAt;
        monthlyPlay.updatedAt = entity.updatedAt;
        return monthlyPlay;
    }
}