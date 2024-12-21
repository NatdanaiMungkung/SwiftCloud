import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from 'typeorm';
import { SongEntity } from './song.entity';

@Entity('monthly_plays')
export class MonthlyPlayEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'song_id' })
    songId: string;

    @Column({
        type: 'enum',
        enum: ['June', 'July', 'August'],
    })
    month: string;

    @Column({ name: 'play_count' })
    playCount: number;

    @ManyToOne(() => SongEntity, song => song.monthlyPlays)
    @JoinColumn({ name: 'song_id' })
    song: SongEntity;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}