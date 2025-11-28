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

@Injectable()
export class FavoritesService {
  private favorites: Favorites = new Favorites();

  constructor(
    @Inject(forwardRef(() => TrackService))
    private readonly trackService: TrackService,
    @Inject(forwardRef(() => AlbumService))
    private readonly albumService: AlbumService,
    @Inject(forwardRef(() => ArtistService))
    private readonly artistService: ArtistService,
  ) {}

  findAll() {
    const artists = this.favorites.artists
      .map((id) => this.artistService.findOne(id))
      .filter((artist) => artist !== undefined);

    const albums = this.favorites.albums
      .map((id) => this.albumService.findOne(id))
      .filter((album) => album !== undefined);

    const tracks = this.favorites.tracks
      .map((id) => this.trackService.findOne(id))
      .filter((track) => track !== undefined);

    return {
      artists,
      albums,
      tracks,
    };
  }

  addTrack(id: string) {
    const track = this.trackService.findOne(id, false);
    if (!track) {
      throw new UnprocessableEntityException('Track does not exist');
    }
    if (!this.favorites.tracks.includes(id)) {
      this.favorites.tracks.push(id);
    }
  }

  removeTrack(id: string) {
    const index = this.favorites.tracks.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Track is not in favorites');
    }
    this.favorites.tracks.splice(index, 1);
  }

  addAlbum(id: string) {
    const album = this.albumService.findOne(id, false);
    if (!album) {
      throw new UnprocessableEntityException('Album does not exist');
    }
    if (!this.favorites.albums.includes(id)) {
      this.favorites.albums.push(id);
    }
  }

  removeAlbum(id: string) {
    const index = this.favorites.albums.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Album is not in favorites');
    }
    this.favorites.albums.splice(index, 1);
  }

  addArtist(id: string) {
    const artist = this.artistService.findOne(id, false);
    if (!artist) {
      throw new UnprocessableEntityException('Artist does not exist');
    }
    if (!this.favorites.artists.includes(id)) {
      this.favorites.artists.push(id);
    }
  }

  removeArtist(id: string) {
    const index = this.favorites.artists.indexOf(id);
    if (index === -1) {
      throw new NotFoundException('Artist is not in favorites');
    }
    this.favorites.artists.splice(index, 1);
  }

  removeFromFavorites(id: string) {
    this.favorites.artists = this.favorites.artists.filter(
      (artistId) => artistId !== id,
    );
    this.favorites.albums = this.favorites.albums.filter(
      (albumId) => albumId !== id,
    );
    this.favorites.tracks = this.favorites.tracks.filter(
      (trackId) => trackId !== id,
    );
  }
}
