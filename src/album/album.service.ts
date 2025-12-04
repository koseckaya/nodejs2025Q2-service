import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Album } from './entity/album.entity';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class AlbumService extends DataService<Album> {
  protected entityClass = Album;

  constructor(
    @InjectRepository(Album)
    albumRepository: Repository<Album>,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super(albumRepository);
  }

  async remove(id: string): Promise<void> {
    await super.remove(id);
    await this.trackService.clearReference(id, 'albumId');
    await this.favoritesService.removeFromFavorites(id);
  }

  async clearReference(id: string, field: 'artistId'): Promise<void> {
    const albums = await this.repository
      .createQueryBuilder()
      .where(`${field} = :id`, { id })
      .getMany();

    for (const album of albums) {
      album[field] = null;
      await this.repository.save(album);
    }
  }
}
