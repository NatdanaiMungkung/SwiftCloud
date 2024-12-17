import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Song } from './song.entity';

@Entity('play_counts')
export class PlayCount {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'song_id' })
    songId: string;

    @Column()
    month: string;

    @Column()
    year: number;

    @Column({ name: 'play_count' })
    playCount: number;

    @ManyToOne(() => Song, song => song.playCounts)
    @JoinColumn({ name: 'song_id' })
    song: Song;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}