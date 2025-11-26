import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Track } from './track.entity';

@Injectable()
export class TrackService extends DataService<Track> {}
