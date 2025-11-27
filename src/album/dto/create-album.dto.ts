import { OmitType } from '@nestjs/mapped-types';
import { Album } from '../album.entity';

export class CreateAlbumDto extends OmitType(Album, ['id'] as const) {}
