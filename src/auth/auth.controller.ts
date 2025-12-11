import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ERROR_MSG } from 'src/shared/constants';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { Public } from 'src/shared/public-routes';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  async signup(@Body() body: AuthCredentialsDto) {
    if (!body.login || !body.password) {
      throw new UnauthorizedException(ERROR_MSG.AUTH_INVALID_DATA);
    }
    const user = await this.authService.signup(body);
    return user;
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: AuthCredentialsDto) {
    if (!body.login || !body.password) {
      throw new UnauthorizedException(ERROR_MSG.AUTH_INVALID_DATA);
    }
    return this.authService.login(body);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: { refreshToken: string }) {
    if (!body?.refreshToken) {
      throw new UnauthorizedException(ERROR_MSG.AUTH_INVALID_REFRESH_TOKEN);
    }
    return this.authService.refresh(body.refreshToken);
  }
}
