import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavoritesModule } from './favorites/favorites.module';
import { User } from './user/entity/user.entity';
import { Artist } from './artist/entity/artist.entity';
import { Album } from './album/entity/album.entity';
import { Track } from './track/entity/track.entity';
import { Favorites } from './favorites/entity/favorites.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT || '5555'),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: [User, Artist, Album, Track, Favorites],
      synchronize: false,
      migrations: ['dist/src/migrations/*.js'],
      migrationsRun: true,
    }),
    TypeOrmModule.forFeature([User, Artist, Album, Track, Favorites]),
    UserModule,
    FavoritesModule,
    TrackModule,
    AlbumModule,
    ArtistModule,
  ],
})
export class AppModule {}
