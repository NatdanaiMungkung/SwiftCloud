import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, OneToMany } from 'typeorm';
import { Artist } from './artist.entity';
import { Writer } from './writer.entity';
import { Album } from './album.entity';
import { PlayCount } from './play-count.entity';


@Entity('songs')
export class Song {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @ManyToMany(() => Artist, artist => artist.songs)
    @JoinTable({
        name: 'song_artists',
        joinColumn: { name: 'song_id' },
        inverseJoinColumn: { name: 'artist_id' },
    })
    artists: Artist[];

    @ManyToMany(() => Writer, writer => writer.songs)
    @JoinTable({
        name: 'song_writers',
        joinColumn: { name: 'song_id' },
        inverseJoinColumn: { name: 'writer_id' },
    })
    writers: Writer[];

    @ManyToOne(() => Album, album => album.songs)
    @Column({ name: 'album_id', nullable: true })
    album: Album;

    @OneToMany(() => PlayCount, playCount => playCount.song)
    playCounts: PlayCount[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}