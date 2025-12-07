import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class UpdateArtistDto {
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  @IsOptional()
  name?: string;

  @IsBoolean()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  @IsOptional()
  grammy?: boolean;
}
