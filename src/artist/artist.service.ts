import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Artist } from './artist.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistService extends DataService<Artist> {
  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super();
  }

  remove(id: string) {
    super.remove(id);

    this.trackService.clearReference(id, 'artistId');
    this.albumService.clearReference(id, 'artistId');
    this.favoritesService.removeFromFavorites(id);
  }
}
