import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Track } from './track.entity';

@Injectable()
export class TrackService extends DataService<Track> {
  clearReference(id: string, field: 'albumId' | 'artistId') {
    const tracks = this.findAll().filter((track) => track[field] === id);

    tracks.forEach((track) => {
      track[field] = null;
    });
  }
}
