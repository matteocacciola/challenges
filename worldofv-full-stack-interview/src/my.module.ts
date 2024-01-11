import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { DataLoaderInterceptor } from 'nestjs-dataloader/dist';
import { Album, Artist, Genre, MediaType, Track } from './entities';
import { ArtistLoader } from './loaders';
import { ArtistService, TrackService } from './services';
import { TrackResolver } from './resolvers';
import { TrackRepository } from './repositories';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
    }),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'chinook.sqlite',
      synchronize: false,
      entities: [Album, Artist, Genre, MediaType, Track],
    }),
    TypeOrmModule.forFeature([Album, Artist, Genre, MediaType, Track]),
  ],
  providers: [
    TrackRepository,
    ArtistService,
    TrackService,
    TrackResolver,
    ArtistLoader,
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
  ],
})
export class MyModule {}
