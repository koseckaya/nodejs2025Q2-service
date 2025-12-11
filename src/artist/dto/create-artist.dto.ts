import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ERROR_MSG } from 'src/shared/constants';

export class CreateArtistDto {
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  name: string;

  @IsBoolean()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  grammy: boolean;
}
