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

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorites)
    private favoritesRepository: Repository<Favorites>,
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
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
    const track = await this.trackService.findOne(id, false);
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }

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
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['tracks'],
    });

    if (!favorites || !favorites.tracks.find((t) => t.id === id)) {
      throw new NotFoundException('Track is not in favorites');
    }

    favorites.tracks = favorites.tracks.filter((t) => t.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addAlbum(id: string) {
    const album = await this.albumService.findOne(id, false);
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }

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
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['albums'],
    });

    if (!favorites || !favorites.albums.find((a) => a.id === id)) {
      throw new NotFoundException('Album is not in favorites');
    }

    favorites.albums = favorites.albums.filter((a) => a.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async addArtist(id: string) {
    const artist = await this.artistService.findOne(id, false);
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }

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
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['artists'],
    });

    if (!favorites || !favorites.artists.find((a) => a.id === id)) {
      throw new NotFoundException('Artist is not in favorites');
    }

    favorites.artists = favorites.artists.filter((a) => a.id !== id);
    await this.favoritesRepository.save(favorites);
  }

  async removeFromFavorites(id: string) {
    const favorites = await this.favoritesRepository.findOne({
      where: {},
      relations: ['artists', 'albums', 'tracks'],
    });

    if (favorites) {
      favorites.artists = favorites.artists.filter((a) => a.id !== id);
      favorites.albums = favorites.albums.filter((a) => a.id !== id);
      favorites.tracks = favorites.tracks.filter((t) => t.id !== id);
      await this.favoritesRepository.save(favorites);
    }
  }
}
