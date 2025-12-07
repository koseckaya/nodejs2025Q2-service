import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Artist } from './entity/artist.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ArtistService extends DataService<Artist> {
  protected entityClass = Artist;

  constructor(
    @InjectRepository(Artist)
    artistRepository: Repository<Artist>,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super(artistRepository);
  }

  async remove(id: string): Promise<void> {
    const artist = await this.findOne(id);
    if (artist) {
      await this.trackService.clearReference(id, 'artistId');
      await this.albumService.clearReference(id, 'artistId');
      await this.favoritesService.removeFromFavorites(id);
      await this.repository.remove(artist);
    }
  }
}
