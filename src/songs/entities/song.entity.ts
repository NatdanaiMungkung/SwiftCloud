import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { ArtistEntity } from './artist.entity';
import { WriterEntity } from './writer.entity';
import { AlbumEntity } from './album.entity';
import { MonthlyPlayEntity } from './monthly-play.entity';

@Entity('songs')
export class SongEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ select: true })
    title: string;

    @Column({ name: 'album_id', nullable: true })
    albumId: string;

    @ManyToMany(() => ArtistEntity, artist => artist.songs)
    @JoinTable({
        name: 'song_artists',
        joinColumn: { name: 'song_id' },
        inverseJoinColumn: { name: 'artist_id' },
    })
    artists: ArtistEntity[];

    @ManyToMany(() => WriterEntity, writer => writer.songs)
    @JoinTable({
        name: 'song_writers',
        joinColumn: { name: 'song_id' },
        inverseJoinColumn: { name: 'writer_id' },
    })
    writers: WriterEntity[];

    @ManyToOne(() => AlbumEntity, album => album.songs)
    @JoinColumn({ name: 'album_id' })
    album: AlbumEntity;

    @Column({ name: 'release_year', nullable: true })
    releaseYear: number;

    @OneToMany(() => MonthlyPlayEntity, monthlyPlay => monthlyPlay.song)
    monthlyPlays: MonthlyPlayEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}