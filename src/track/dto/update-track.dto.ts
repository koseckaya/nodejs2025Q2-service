import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateTrackDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsUUID(4)
  @IsOptional()
  artistId?: string;

  @IsUUID(4)
  @IsOptional()
  albumId?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  @IsOptional()
  duration: number;
}
