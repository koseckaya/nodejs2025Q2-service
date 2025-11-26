import { Injectable, NotFoundException } from '@nestjs/common';
import { ERROR_MSG } from '../constants';
import { v4 as uuidv4 } from 'uuid';

interface DataRecord {
  id?: string;
}

@Injectable()
export class DataService<T extends DataRecord> {
  private records: { [id: string]: T } = {};

  create(record: Partial<T>) {
    const id = uuidv4();
    const newRecord = { id, ...record } as T;
    this.records[id] = newRecord;
    return this.plainToInstance(newRecord);
  }

  findAll() {
    return Object.values(this.records).map((record) =>
      this.plainToInstance(record),
    );
  }

  findOne(id: string) {
    const record = this.getRecord(id);
    return this.plainToInstance(record);
  }

  getRecord(id: string) {
    const record = this.records[id];
    if (!record) {
      throw new NotFoundException(`${ERROR_MSG.ID_NOT_FOUND} ${id}`);
    }
    return record;
  }

  update(id: string, record: Partial<T>) {
    const recordForUpdate = this.getRecord(id);
    const updatedRecord = { ...recordForUpdate, ...record };
    this.records[id] = updatedRecord;
    return this.plainToInstance(updatedRecord);
  }

  remove(id: string) {
    const recordForUpdate = this.getRecord(id);
    if (recordForUpdate) {
      delete this.records[id];
    }
  }

  protected plainToInstance(record: T): T {
    return record;
  }
}
