import { OmitType } from '@nestjs/mapped-types';
import { Artist } from '../entity/artist.entity';

export class UpdateArtistDto extends OmitType(Artist, ['id'] as const) {}
