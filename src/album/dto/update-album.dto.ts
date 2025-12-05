import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class UpdateAlbumDto {
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  @IsOptional()
  name?: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  @IsOptional()
  year?: number;

  @IsUUID(4)
  @IsOptional()
  artistId?: string;
}
