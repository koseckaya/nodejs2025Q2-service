import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
  forwardRef,
} from '@nestjs/common';
import { Favorites } from './entity/favorites.entity';
import { TrackService } from '../track/track.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoggingService } from 'src/logger/logger.service';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private readonly favoritesRepository: Repository<Favorites>,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
    private readonly logger: LoggingService,
  ) {}

  async findAll() {
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['artists', 'albums', 'tracks'],
    });

    if (!favorites) {
      const newFavorites = this.favoritesRepository.create();
      await this.favoritesRepository.save(newFavorites);
      return {
        artists: [],
        albums: [],
        tracks: [],
      };
    }

    return {
      artists: favorites.artists || [],
      albums: favorites.albums || [],
      tracks: favorites.tracks || [],
    };
  }

  async addTrack(id: string) {
    this.logger.debug(`[FavoritesService] addTrack called with id: ${id}`);

    const track = await this.trackService.findOne(id, false);
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

    this.logger.debug(`[FavoritesService] track found: ${!!track}`);

    let favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['tracks'],
    });

    if (!favorites) {
      favorites = this.favoritesRepository.create();
    }

    if (!favorites.tracks) {
      favorites.tracks = [];
    }

    if (!favorites.tracks.find((t) => t.id === id)) {
      favorites.tracks.push(track);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeTrack(id: string) {
    this.logger.debug(`[FavoritesService] removeTrack called with id: ${id}`);

    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['tracks'],
    });

    if (!favorites?.tracks?.find((t) => t.id === id)) {
      throw new NotFoundException('Track is not in favorites');
    }

    this.logger.debug(`[FavoritesService] favorites found: ${!!favorites}`);

    favorites.tracks = favorites.tracks.filter((t) => t.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string) {
    this.logger.debug(`[FavoritesService] addAlbum called with id: ${id}`);

    const album = await this.albumService.findOne(id, false);
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

    this.logger.debug(`[FavoritesService] Finding album: ${!!album}`);

    let favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['albums'],
    });

    if (!favorites) {
      favorites = this.favoritesRepository.create();
    }

    if (!favorites.albums) {
      favorites.albums = [];
    }

    if (!favorites.albums.find((a) => a.id === id)) {
      favorites.albums.push(album);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeAlbum(id: string) {
    this.logger.debug(`[FavoritesService] removeAlbum called with id: ${id}`);
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['albums'],
    });

    if (!favorites?.albums?.find((a) => a.id === id)) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.logger.debug(`[FavoritesService] favorites found: ${!!favorites}`);

    favorites.albums = favorites.albums.filter((a) => a.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addArtist(id: string) {
    this.logger.debug(`[FavoritesService] addArtist called with id: ${id}`);
    const artist = await this.artistService.findOne(id, false);
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    this.logger.debug(`[FavoritesService] Finding artist: ${!!artist}`);

    let favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['artists'],
    });

    if (!favorites) {
      favorites = this.favoritesRepository.create();
    }

    if (!favorites.artists) {
      favorites.artists = [];
    }

    if (!favorites.artists.find((a) => a.id === id)) {
      favorites.artists.push(artist);
      await this.favoritesRepository.save(favorites);
    }
  }

  async removeArtist(id: string) {
    this.logger.debug(`[FavoritesService] removeArtist called with id: ${id}`);
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['artists'],
    });

    if (!favorites?.artists?.find((a) => a.id === id)) {
      throw new NotFoundException('Artist is not in favorites');
    }

    this.logger.debug(`[FavoritesService] favorites found: ${!!favorites}`);

    favorites.artists = favorites.artists.filter((a) => a.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async removeFromFavorites(id: string) {
    this.logger.debug(
      `[FavoritesService] removeFromFavorites called with id: ${id}`,
    );
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['artists', 'albums', 'tracks'],
    });
    this.logger.debug(`[FavoritesService] favorites found: ${!!favorites}`);

    if (favorites) {
      favorites.artists = favorites.artists.filter((a) => a.id !== id);
      favorites.albums = favorites.albums.filter((a) => a.id !== id);
      favorites.tracks = favorites.tracks.filter((t) => t.id !== id);
      await this.favoritesRepository.save(favorites);
    }
  }
}
