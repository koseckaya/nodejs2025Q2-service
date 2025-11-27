import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Track } from './track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService extends DataService<Track> {
  constructor(
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super();
  }

  remove(id: string) {
    super.remove(id);
    this.favoritesService.removeFromFavorites(id);
  }

  clearReference(id: string, field: 'albumId' | 'artistId') {
    const tracks = this.findAll().filter((track) => track[field] === id);

    tracks.forEach((track) => {
      track[field] = null;
    });
  }
}
