import { Injectable } from '@nestjs/common';
import { DataService } from 'src/data/data.service';
import { Album } from './album.entity';

@Injectable()
export class AlbumService extends DataService<Album> {}
