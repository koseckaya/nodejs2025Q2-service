import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateColumnName1764969262293 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename columns in tracks table
    await queryRunner.query(
      `ALTER TABLE tracks RENAME COLUMN artist_id TO "artistId"`,
    );
    await queryRunner.query(
      `ALTER TABLE tracks RENAME COLUMN album_id TO "albumId"`,
    );

    // Rename columns in albums table
    await queryRunner.query(
      `ALTER TABLE albums RENAME COLUMN artist_id TO "artistId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert column names in tracks table
    await queryRunner.query(
      `ALTER TABLE tracks RENAME COLUMN "artistId" TO artist_id`,
    );
    await queryRunner.query(
      `ALTER TABLE tracks RENAME COLUMN "albumId" TO album_id`,
    );

    // Revert column names in albums table
    await queryRunner.query(
      `ALTER TABLE albums RENAME COLUMN "artistId" TO artist_id`,
    );
  }
}
