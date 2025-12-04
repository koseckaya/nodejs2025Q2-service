import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Track } from './entity/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TrackService extends DataService<Track> {
  protected entityClass = Track;

  constructor(
    @InjectRepository(Track)
    trackRepository: Repository<Track>,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
  ) {
    super(trackRepository);
  }

  async remove(id: string): Promise<void> {
    await super.remove(id);
    await this.favoritesService.removeFromFavorites(id);
  }

  async clearReference(
    id: string,
    field: 'albumId' | 'artistId',
  ): Promise<void> {
    const tracks = await this.repository
      .createQueryBuilder()
      .where(`${field} = :id`, { id })
      .getMany();

    for (const track of tracks) {
      track[field] = null;
      await this.repository.save(track);
    }
  }
}
