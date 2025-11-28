import { OmitType } from '@nestjs/mapped-types';
import { Track } from '../entity/track.entity';

export class CreateTrackDto extends OmitType(Track, ['id'] as const) {}
