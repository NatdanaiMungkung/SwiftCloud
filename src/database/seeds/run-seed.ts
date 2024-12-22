import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { MusicSeeder } from './music.seed';

config();

const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: ['src/**/*.entity{.ts,.js}'],
    ssl: {
        rejectUnauthorized: false, // Disable strict validation for development
    },
});

async function main() {
    try {
        await dataSource.initialize();
        console.log('Connected to database');

        const seeder = new MusicSeeder(dataSource);
        await seeder.run();

        console.log('Seeding completed');
        process.exit(0);
    } catch (err) {
        console.error('Error during seeding:', err);
        process.exit(1);
    }
}

main();