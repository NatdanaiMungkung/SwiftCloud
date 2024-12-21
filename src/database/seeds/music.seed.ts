import { DataSource } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'papaparse';
import { ArtistEntity } from '../../songs/entities/artist.entity';
import { WriterEntity } from '../../songs/entities/writer.entity';
import { AlbumEntity } from '../../songs/entities/album.entity';
import { SongEntity } from '../../songs/entities/song.entity';
import { MonthlyPlayEntity } from '../../songs/entities/monthly-play.entity';

export class MusicSeeder {
    constructor(private dataSource: DataSource) { }

    async run() {
        try {
            // Read CSV file
            const csvContent = fs.readFileSync(
                path.join(__dirname, '../../../SwiftCloud - Sheet1.csv'),
                'utf-8'
            );

            const parsed = parse(csvContent, {
                header: true,
                skipEmptyLines: true,
            });

            const queryRunner = this.dataSource.createQueryRunner();
            await queryRunner.connect();
            await queryRunner.startTransaction();

            try {
                // Create artists
                const artistMap = new Map<string, string>();
                for (const row of parsed.data) {
                    const artists = row.Artist.split('\n').map(a => a.trim());
                    for (const artistName of artists) {
                        if (!artistMap.has(artistName)) {
                            const artist = await queryRunner.manager
                                .createQueryBuilder()
                                .insert()
                                .into(ArtistEntity)
                                .values({ name: artistName })
                                .returning('id')
                                .execute();
                            artistMap.set(artistName, artist.raw[0].id);
                        }
                    }
                }

                // Create writers
                const writerMap = new Map<string, string>();
                for (const row of parsed.data) {
                    const writers = row.Writer.split('\n').map(w => w.trim());
                    for (const writerName of writers) {
                        if (!writerMap.has(writerName)) {
                            const writer = await queryRunner.manager
                                .createQueryBuilder()
                                .insert()
                                .into(WriterEntity)
                                .values({ name: writerName })
                                .returning('id')
                                .execute();
                            writerMap.set(writerName, writer.raw[0].id);
                        }
                    }
                }

                // Create albums
                const albumMap = new Map<string, string>();
                for (const row of parsed.data) {
                    if (!albumMap.has(row.Album) && row.Album !== 'None' && !row.Album.startsWith('None[')) {
                        const album = await queryRunner.manager
                            .createQueryBuilder()
                            .insert()
                            .into(AlbumEntity)
                            .values({ title: row.Album })
                            .returning('id')
                            .execute();
                        albumMap.set(row.Album, album.raw[0].id);
                    }
                }

                // Create songs and relationships
                for (const row of parsed.data) {
                    // Create song
                    const songInsert = await queryRunner.manager
                        .createQueryBuilder()
                        .insert()
                        .into(SongEntity)
                        .values({
                            title: row.Song,
                            releaseYear: parseInt(row.Year),
                            albumId: albumMap.get(row.Album),
                        })
                        .returning('id')
                        .execute();

                    const songId = songInsert.raw[0].id;

                    // Create artist relationships
                    const artists = row.Artist.split('\n').map(a => a.trim());
                    for (const artistName of artists) {
                        await queryRunner.manager.query(
                            `INSERT INTO song_artists (song_id, artist_id) VALUES ($1, $2)`,
                            [songId, artistMap.get(artistName)]
                        );
                    }

                    // Create writer relationships
                    const writers = row.Writer.split('\n').map(w => w.trim());
                    for (const writerName of writers) {
                        await queryRunner.manager.query(
                            `INSERT INTO song_writers (song_id, writer_id) VALUES ($1, $2)`,
                            [songId, writerMap.get(writerName)]
                        );
                    }

                    // Create monthly plays
                    const months = ['June', 'July', 'August'];
                    for (const month of months) {
                        const playCount = parseInt(row[`Plays - ${month}`]);
                        if (!isNaN(playCount)) {
                            await queryRunner.manager
                                .createQueryBuilder()
                                .insert()
                                .into(MonthlyPlayEntity)
                                .values({
                                    songId,
                                    month,
                                    playCount,
                                })
                                .execute();
                        }
                    }
                }

                await queryRunner.commitTransaction();
                console.log('Seeding completed successfully');
            } catch (err) {
                console.error('Error during seeding:', err);
                await queryRunner.rollbackTransaction();
                throw err;
            } finally {
                await queryRunner.release();
            }
        } catch (err) {
            console.error('Error reading CSV file:', err);
            throw err;
        }
    }
}