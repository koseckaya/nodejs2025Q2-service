import { Injectable } from '@nestjs/common';
import { User } from './entity/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DataService } from 'src/data/data.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService extends DataService<User> {
  protected entityClass = User;

  constructor(
    @InjectRepository(User)
    userRepository: Repository<User>,
  ) {
    super(userRepository);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    return super.create({
      ...createUserDto,
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  async getCurrentPassword(id: string): Promise<string> {
    const user = await this.repository
      .createQueryBuilder('user')
      .select('user.password')
      .where('user.id = :id', { id })
      .getOne();
    return user?.password;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    return this.update(id, {
      password: updatePasswordDto.newPassword,
      version: (await this.findOne(id)).version + 1,
      updatedAt: new Date(),
    });
  }

  async findByLogin(login: string): Promise<User | undefined> {
    return this.repository.findOne({ where: { login } });
  }
}
