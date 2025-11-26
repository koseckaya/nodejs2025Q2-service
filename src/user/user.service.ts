import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DataService } from 'src/data/data.service';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class UserService extends DataService<User> {
  create(createUserDto: CreateUserDto) {
    const user = {
      ...createUserDto,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    return super.create(user);
  }

  getCurrentPassword(id: string): string {
    const record = this.getRecord(id);
    return record.password;
  }

  updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Omit<User, 'password'> {
    const user = this.getRecord(id);

    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();

    return this.findOne(id);
  }

  protected plainToInstance(record: User): User {
    return plainToInstance(User, record);
  }
}
