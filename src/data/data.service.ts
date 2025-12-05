import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MSG } from '../constants';
import { DeepPartial, Repository } from 'typeorm';
import { ClassConstructor, plainToInstance } from 'class-transformer';

interface DataRecord {
  id: string;
}

@Injectable()
export abstract class DataService<T extends DataRecord> {
  protected abstract entityClass: ClassConstructor<T>;

  constructor(protected repository: Repository<T>) {}

  async create(record: DeepPartial<T>): Promise<T> {
    const newRecord = this.repository.create(record);
    await this.repository.save(newRecord);
    return this.plainToInstance(newRecord);
  }

  async findAll(): Promise<T[]> {
    const records = await this.repository.find();
    return records.map((record) => this.plainToInstance(record));
  }

  async findOne(id: string, checkExists = true): Promise<T> {
    const record = await this.repository.findOne({ where: { id } as any });
    if (!record && checkExists) {
      throw new NotFoundException(`${ERROR_MSG.ID_NOT_FOUND} ${id}`);
    }
    return record ? this.plainToInstance(record) : null;
  }

  async getRecord(id: string, checkExists = true): Promise<T> {
    const record = await this.findOne(id, checkExists);
    if (!record && checkExists) {
      throw new NotFoundException(`${ERROR_MSG.ID_NOT_FOUND} ${id}`);
    }
    return record;
  }

  async update(id: string, record: DeepPartial<T>): Promise<T> {
    const existingRecord = await this.findOne(id);
    await this.repository.update(id, record as any);
    const updatedRecord = await this.repository.findOne({
      where: { id } as any,
    });
    return this.plainToInstance(updatedRecord);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    if (record) {
      await this.repository.remove(record);
    }
  }

  protected plainToInstance(record: T): T {
    return plainToInstance(this.entityClass, record as object, {
      excludeExtraneousValues: true,
    });
  }
}
