import { OmitType } from '@nestjs/mapped-types';
import { Artist } from '../artist.entity';

export class UpdateArtistDto extends OmitType(Artist, ['id'] as const) {}
