import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, IsUUID, Min } from 'class-validator';
import { ERROR_MSG } from '../../shared/constants';
import { CreateDateColumn, UpdateDateColumn, BeforeUpdate } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @Expose()
  id: string;

  @Column({ unique: true })
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.USER_CREATE_INVALID_DATA })
  @Expose()
  login: string;

  @Column()
  @Exclude()
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.USER_CREATE_INVALID_DATA })
  password: string;

  @Column({ default: 1 })
  @IsInt()
  @Min(1)
  @Expose()
  version: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  @Expose()
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Transform(({ value }) => (value instanceof Date ? value.getTime() : value))
  @Expose()
  updatedAt: Date;

  @BeforeUpdate()
  updateVersion() {
    this.version += 1;
  }
}
