import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Album } from './album.entity';
import { TrackService } from 'src/track/track.service';

@Injectable()
export class AlbumService extends DataService<Album> {
  constructor(private readonly trackService: TrackService) {
    super();
  }

  remove(id: string) {
    super.remove(id);
    this.trackService.clearReference(id, 'albumId');
  }

  clearReference(id: string, field: 'artistId') {
    const tracks = this.findAll().filter((track) => track[field] === id);

    tracks.forEach((track) => {
      track[field] = null;
    });
  }
}
