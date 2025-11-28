import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class Album {
  @IsUUID(4)
  id: string;

  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  name: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  year: number;

  @IsUUID(4)
  @IsOptional()
  artistId: string | null = null;
}
