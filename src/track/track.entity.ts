import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class Track {
  @IsUUID(4)
  id: string;

  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.TRACK_CREATE_INVALID_DATA })
  name: string;

  @IsUUID(4)
  @IsOptional()
  artistId: string | null;

  @IsUUID(4)
  @IsOptional()
  albumId: string | null;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: ERROR_MSG.TRACK_CREATE_INVALID_DATA })
  duration: number;
}
