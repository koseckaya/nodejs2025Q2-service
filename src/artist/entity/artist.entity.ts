import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class Artist {
  @IsUUID(4)
  id: string;

  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  grammy: boolean;
}
