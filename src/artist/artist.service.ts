import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Artist } from './artist.entity';
import { TrackService } from 'src/track/track.service';
import { AlbumService } from 'src/album/album.service';

@Injectable()
export class ArtistService extends DataService<Artist> {
  constructor(
    private readonly trackService: TrackService,
    private readonly albumService: AlbumService,
  ) {
    super();
  }

  remove(id: string) {
    super.remove(id);

    this.trackService.clearReference(id, 'artistId');
    this.albumService.clearReference(id, 'artistId');
  }
}
