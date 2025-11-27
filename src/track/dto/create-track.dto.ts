import { OmitType } from '@nestjs/mapped-types';
import { Track } from '../track.entity';

export class CreateTrackDto extends OmitType(Track, ['id'] as const) {}
