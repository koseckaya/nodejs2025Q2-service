import { IsNotEmpty, IsString } from 'class-validator';
import { ERROR_MSG } from 'src/constants';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.USER_CREATE_INVALID_DATA })
  login: string;

  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.USER_CREATE_INVALID_DATA })
  password: string;
}
