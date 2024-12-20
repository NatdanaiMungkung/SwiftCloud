import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CacheModule } from '@nestjs/cache-manager';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { getTypeOrmConfig } from './config/typeorm.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env${process.env.NODE_ENV ? '.' + process.env.NODE_ENV : ''}`,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => getTypeOrmConfig(),
    }),
    CacheModule.register({
      isGlobal: true, // Make cache available globally
      ttl: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
      max: 1000, // Maximum number of items in cache
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      // cache: true, // Enable Apollo Cache Control
    }),
    TypeOrmModule.forRoot({
      // your database config...
    }),
    // other modules...
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
