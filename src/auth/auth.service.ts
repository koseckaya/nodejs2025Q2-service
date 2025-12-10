import { Injectable, ForbiddenException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { ERROR_MSG, SALT_ROUNDS } from 'src/shared/constants';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async signup({ login, password }: AuthCredentialsDto) {
    const passwordHash = await hash(password, SALT_ROUNDS);
    return this.userService.create({ login, password: passwordHash });
  }

  async validateUser(login: string, password: string) {
    const user = await this.userService.findByLogin(login);
    const userPassword = await this.userService.getCurrentPassword(user.id);
    if (!user) throw new ForbiddenException(ERROR_MSG.AUTH_INVALID_DATA);
    const isMatch = await compare(password, userPassword);
    if (!isMatch) throw new ForbiddenException(ERROR_MSG.AUTH_INVALID_DATA);
    return user;
  }

  async login({ login, password }: AuthCredentialsDto) {
    const user = await this.validateUser(login, password);
    const payload = { userId: user.id, login: user.login };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });
    return { accessToken, refreshToken };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken);
      const user = await this.userService.findOne(payload.userId);
      if (!user)
        throw new ForbiddenException(ERROR_MSG.AUTH_INVALID_REFRESH_TOKEN);
      return this.login(user);
    } catch {
      throw new ForbiddenException(ERROR_MSG.AUTH_INVALID_REFRESH_TOKEN);
    }
  }
}
