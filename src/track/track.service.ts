import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Track } from './entity/track.entity';
import { FavoritesService } from 'src/favorites/favorites.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ArtistService } from '../artist/artist.service';
import { AlbumService } from '../album/album.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService extends DataService<Track> {
  protected entityClass = Track;
  constructor(
    @InjectRepository(Track)
    trackRepository: Repository<Track>,
    @Inject(forwardRef(() => FavoritesService))
    private readonly favoritesService: FavoritesService,
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
  ) {
    super(trackRepository);
  }

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
    if (createTrackDto.artistId) {
      const artist = await this.artistService.findOne(
        createTrackDto.artistId,
        false,
      );
      if (!artist) {
        throw new NotFoundException(
          `Artist with id ${createTrackDto.artistId} not found`,
        );
      }
    }

    if (createTrackDto.albumId) {
      const album = await this.albumService.findOne(
        createTrackDto.albumId,
        false,
      );
      if (!album) {
        throw new NotFoundException(
          `Album with id ${createTrackDto.albumId} not found`,
        );
      }
    }

    return super.create(createTrackDto);
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
    if (updateTrackDto.artistId) {
      const artist = await this.artistService.findOne(
        updateTrackDto.artistId,
        false,
      );
      if (!artist) {
        throw new NotFoundException(
          `Artist with id ${updateTrackDto.artistId} not found`,
        );
      }
    }

    if (updateTrackDto.albumId) {
      const album = await this.albumService.findOne(
        updateTrackDto.albumId,
        false,
      );
      if (!album) {
        throw new NotFoundException(
          `Album with id ${updateTrackDto.albumId} not found`,
        );
      }
    }

    return super.update(id, updateTrackDto);
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
      .createQueryBuilder('track')
      .where(`track.${field} = :id`, { id })
      .getMany();

    for (const track of tracks) {
      track[field] = null;
      await this.repository.save(track);
    }
  }
}
