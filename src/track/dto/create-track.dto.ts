import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateTrackDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsUUID(4)
  @IsOptional()
  artistId?: string;

  @IsUUID(4)
  @IsOptional()
  albumId?: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  duration: number;
}
