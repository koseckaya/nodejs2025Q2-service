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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { hash, compare } from 'bcrypt';
import { SALT_ROUNDS } from 'src/constants';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto) {
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
    const user = this.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const currentPassword = this.userService.getCurrentPassword(id);
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
  @HttpCode(204)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.userService.remove(id);
  }
}
