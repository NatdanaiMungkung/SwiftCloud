import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class CreateMusicTables1734693758220 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Create artists table
    await queryRunner.createTable(
      new Table({
        name: 'artists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create unique index on artist name
    await queryRunner.createIndex(
      'artists',
      new TableIndex({
        name: 'IDX_ARTISTS_NAME_UNIQUE',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    // Create writers table
    await queryRunner.createTable(
      new Table({
        name: 'writers',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create unique index on writer name
    await queryRunner.createIndex(
      'writers',
      new TableIndex({
        name: 'IDX_WRITERS_NAME_UNIQUE',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    // Create albums table
    await queryRunner.createTable(
      new Table({
        name: 'albums',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create songs table
    await queryRunner.createTable(
      new Table({
        name: 'songs',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'album_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'release_year',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create song_artists junction table
    await queryRunner.createTable(
      new Table({
        name: 'song_artists',
        columns: [
          {
            name: 'song_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'artist_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create song_writers junction table
    await queryRunner.createTable(
      new Table({
        name: 'song_writers',
        columns: [
          {
            name: 'song_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'writer_id',
            type: 'uuid',
            isPrimary: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Create monthly_plays table
    await queryRunner.createTable(
      new Table({
        name: 'monthly_plays',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'song_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'month',
            type: 'enum',
            enum: ['June', 'July', 'August'],
            isNullable: false,
          },
          {
            name: 'play_count',
            type: 'integer',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    // Add foreign key constraints
    await queryRunner.createForeignKey(
      'songs',
      new TableForeignKey({
        name: 'FK_SONGS_ALBUM',
        columnNames: ['album_id'],
        referencedTableName: 'albums',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    await queryRunner.createForeignKey(
      'song_artists',
      new TableForeignKey({
        name: 'FK_SONG_ARTISTS_SONG',
        columnNames: ['song_id'],
        referencedTableName: 'songs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'song_artists',
      new TableForeignKey({
        name: 'FK_SONG_ARTISTS_ARTIST',
        columnNames: ['artist_id'],
        referencedTableName: 'artists',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'song_writers',
      new TableForeignKey({
        name: 'FK_SONG_WRITERS_SONG',
        columnNames: ['song_id'],
        referencedTableName: 'songs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'song_writers',
      new TableForeignKey({
        name: 'FK_SONG_WRITERS_WRITER',
        columnNames: ['writer_id'],
        referencedTableName: 'writers',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'monthly_plays',
      new TableForeignKey({
        name: 'FK_MONTHLY_PLAYS_SONG',
        columnNames: ['song_id'],
        referencedTableName: 'songs',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // Create additional indexes
    await queryRunner.createIndex(
      'songs',
      new TableIndex({
        name: 'IDX_SONGS_TITLE',
        columnNames: ['title'],
      }),
    );

    await queryRunner.createIndex(
      'songs',
      new TableIndex({
        name: 'IDX_SONGS_RELEASE_YEAR',
        columnNames: ['release_year'],
      }),
    );

    await queryRunner.createIndex(
      'monthly_plays',
      new TableIndex({
        name: 'IDX_MONTHLY_PLAYS_SONG_MONTH',
        columnNames: ['song_id', 'month'],
        isUnique: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('monthly_plays');
    await queryRunner.dropTable('song_writers');
    await queryRunner.dropTable('song_artists');
    await queryRunner.dropTable('songs');
    await queryRunner.dropTable('albums');
    await queryRunner.dropTable('writers');
    await queryRunner.dropTable('artists');
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp"`);
  }
}
