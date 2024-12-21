import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToMany } from 'typeorm';
import { SongEntity } from './song.entity';

@Entity('artists')
export class ArtistEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ select: true })
    name: string;

    @ManyToMany(() => SongEntity, song => song.artists)
    songs: SongEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}