import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Album } from './entity/album.entity';
import { TrackService } from 'src/track/track.service';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistService } from '../artist/artist.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

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
    private readonly artistService: ArtistService,
  ) {
    super(albumRepository);
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    if (createAlbumDto.artistId) {
      const artist = await this.artistService.findOne(
        createAlbumDto.artistId,
        false,
      );
      if (!artist) {
        throw new NotFoundException(
          `Artist with id ${createAlbumDto.artistId} not found`,
        );
      }
    }
    return super.create(createAlbumDto);
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    if (updateAlbumDto.artistId) {
      const artist = await this.artistService.findOne(
        updateAlbumDto.artistId,
        false,
      );
      if (!artist) {
        throw new NotFoundException(
          `Artist with id ${updateAlbumDto.artistId} not found`,
        );
      }
    }
    return super.update(id, updateAlbumDto);
  }

  async remove(id: string): Promise<void> {
    await super.remove(id);
    await this.trackService.clearReference(id, 'albumId');
    await this.favoritesService.removeFromFavorites(id);
  }

  async clearReference(id: string, field: 'artistId'): Promise<void> {
    const albums = await this.repository
      .createQueryBuilder('album')
      .where(`album.${field} = :id`, { id })
      .getMany();

    for (const album of albums) {
      album[field] = null;
      await this.repository.save(album);
    }
  }
}
