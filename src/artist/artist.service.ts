import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService extends DataService<Artist> {}
