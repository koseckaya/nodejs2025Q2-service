import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Album } from './entity/album.entity';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class AlbumService extends DataService<Album> {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super();
  }

  remove(id: string) {
    super.remove(id);
    this.trackService.clearReference(id, 'albumId');
    this.favoritesService.removeFromFavorites(id);
  }

  clearReference(id: string, field: 'artistId') {
    const albums = this.findAll().filter((album) => album[field] === id);

    albums.forEach((album) => {
      album[field] = null;
    });
  }
}
