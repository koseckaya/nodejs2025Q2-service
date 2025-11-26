import { Exclude } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class User {
  @IsUUID(4)
  id: string;

  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.USER_CREATE_INVALID_DATA })
  login: string;

  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.USER_CREATE_INVALID_DATA })
  @Exclude()
  password: string;

  @IsInt()
  @Min(1)
  version: number;

  @IsInt()
  createdAt: number;

  @IsInt()
  updatedAt: number;
}
