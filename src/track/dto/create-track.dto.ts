import { OmitType } from '@nestjs/mapped-types';
import { Track } from '../track.entity';
import { IsOptional, IsUUID } from 'class-validator';

export class CreateTrackDto extends OmitType(Track, [
  'id',
  'artistId',
  'albumId',
] as const) {
  @IsOptional()
  @IsUUID('4')
  artistId?: string | null;

  @IsOptional()
  @IsUUID('4')
  albumId?: string | null;

  constructor() {
    super();
    this.artistId = null;
    this.albumId = null;
  }
}
