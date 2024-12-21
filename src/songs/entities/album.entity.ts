import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { SongEntity } from './song.entity';

@Entity('albums')
export class AlbumEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ select: true })
    title: string;

    @OneToMany(() => SongEntity, song => song.album)
    songs: SongEntity[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}