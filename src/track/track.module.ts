import { forwardRef, Module } from '@nestjs/common';
import { TrackController } from './track.controller';
import { TrackService } from './track.service';
import { FavoritesModule } from 'src/favorites/favorites.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Track } from './entity/track.entity';
import { ArtistModule } from 'src/artist/artist.module';
import { AlbumModule } from 'src/album/album.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([Track]),

    forwardRef(() => FavoritesModule),
    ArtistModule,
    AlbumModule,
  ],
  controllers: [TrackController],
  providers: [TrackService],
  exports: [TrackService],
})
export class TrackModule {}
