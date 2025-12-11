import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  ParseUUIDPipe,
  NotFoundException,
  ForbiddenException,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { hash, compare } from 'bcryptjs';
import { SALT_ROUNDS } from 'src/shared/constants';
import { LoggingService } from 'src/logger/logger.service';
import { sanitize } from 'src/shared/sanitaze';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  findAll() {
    this.logger.verbose('[UserController] findAll called');
    return this.userService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(`[UserController] findOne called with id: ${id}`);
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto) {
    this.logger.verbose(
      `[UserController] create called with data: ${JSON.stringify(sanitize(createUserDto))}`,
    );
    const passwordHash = await hash(createUserDto.password, SALT_ROUNDS);
    return this.userService.create({
      ...createUserDto,
      password: passwordHash,
    });
  }

  @Put(':id')
  async updatePassword(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    this.logger.verbose(
      `[UserController] updatePassword called with id: ${id} and data: ${JSON.stringify(sanitize(updatePasswordDto))}`,
    );
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const currentPassword = await this.userService.getCurrentPassword(id);
    const isPasswordValid = await compare(
      updatePasswordDto.oldPassword,
      currentPassword,
    );
    if (!isPasswordValid) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const newPasswordHash = await hash(
      updatePasswordDto.newPassword,
      SALT_ROUNDS,
    );
    return this.userService.updatePassword(id, {
      ...updatePasswordDto,
      newPassword: newPasswordHash,
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    this.logger.verbose(`[UserController] remove called with id: ${id}`);
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.userService.remove(id);
  }
}
