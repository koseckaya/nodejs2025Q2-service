import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLoginUnique1764965568408 implements MigrationInterface {
  name = 'RemoveLoginUnique1764965568408';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "UQ_users_login"
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            ALTER TABLE "users" ADD CONSTRAINT "UQ_users_login" UNIQUE ("login")
        `);
  }
}
