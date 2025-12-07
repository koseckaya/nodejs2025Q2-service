import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialMigration1764962113245 implements MigrationInterface {
  name = 'InitialMigration1764962113245';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Users table
    await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "login" character varying NOT NULL,
                "password" character varying NOT NULL,
                "version" integer NOT NULL DEFAULT 1,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_users_login" UNIQUE ("login"),
                CONSTRAINT "PK_users" PRIMARY KEY ("id")
            )
        `);

    // Artists table
    await queryRunner.query(`
            CREATE TABLE "artists" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "grammy" boolean NOT NULL,
                CONSTRAINT "PK_artists" PRIMARY KEY ("id")
            )
        `);

    // Albums table
    await queryRunner.query(`
            CREATE TABLE "albums" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "year" integer NOT NULL,
                "artist_id" uuid,
                CONSTRAINT "PK_albums" PRIMARY KEY ("id")
            )
        `);

    // Tracks table
    await queryRunner.query(`
            CREATE TABLE "tracks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "artist_id" uuid,
                "album_id" uuid,
                "duration" integer NOT NULL,
                CONSTRAINT "PK_tracks" PRIMARY KEY ("id")
            )
        `);

    // Favorites table
    await queryRunner.query(`
            CREATE TABLE "favorites" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                CONSTRAINT "PK_favorites" PRIMARY KEY ("id")
            )
        `);

    // Favorites junction tables
    await queryRunner.query(`
            CREATE TABLE "favorites_artists" (
                "favorites_id" uuid NOT NULL,
                "artist_id" uuid NOT NULL,
                CONSTRAINT "PK_favorites_artists" PRIMARY KEY ("favorites_id", "artist_id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "favorites_albums" (
                "favorites_id" uuid NOT NULL,
                "album_id" uuid NOT NULL,
                CONSTRAINT "PK_favorites_albums" PRIMARY KEY ("favorites_id", "album_id")
            )
        `);

    await queryRunner.query(`
            CREATE TABLE "favorites_tracks" (
                "favorites_id" uuid NOT NULL,
                "track_id" uuid NOT NULL,
                CONSTRAINT "PK_favorites_tracks" PRIMARY KEY ("favorites_id", "track_id")
            )
        `);

    // Add foreign key constraints
    await queryRunner.query(`
            ALTER TABLE "albums"
            ADD CONSTRAINT "FK_albums_artist"
            FOREIGN KEY ("artist_id")
            REFERENCES "artists"("id")
            ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "tracks"
            ADD CONSTRAINT "FK_tracks_artist"
            FOREIGN KEY ("artist_id")
            REFERENCES "artists"("id")
            ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "tracks"
            ADD CONSTRAINT "FK_tracks_album"
            FOREIGN KEY ("album_id")
            REFERENCES "albums"("id")
            ON DELETE SET NULL
        `);

    await queryRunner.query(`
            ALTER TABLE "favorites_artists"
            ADD CONSTRAINT "FK_favorites_artists_favorites"
            FOREIGN KEY ("favorites_id")
            REFERENCES "favorites"("id")
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "favorites_artists"
            ADD CONSTRAINT "FK_favorites_artists_artist"
            FOREIGN KEY ("artist_id")
            REFERENCES "artists"("id")
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "favorites_albums"
            ADD CONSTRAINT "FK_favorites_albums_favorites"
            FOREIGN KEY ("favorites_id")
            REFERENCES "favorites"("id")
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "favorites_albums"
            ADD CONSTRAINT "FK_favorites_albums_album"
            FOREIGN KEY ("album_id")
            REFERENCES "albums"("id")
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "favorites_tracks"
            ADD CONSTRAINT "FK_favorites_tracks_favorites"
            FOREIGN KEY ("favorites_id")
            REFERENCES "favorites"("id")
            ON DELETE CASCADE
        `);

    await queryRunner.query(`
            ALTER TABLE "favorites_tracks"
            ADD CONSTRAINT "FK_favorites_tracks_track"
            FOREIGN KEY ("track_id")
            REFERENCES "tracks"("id")
            ON DELETE CASCADE
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys first
    await queryRunner.query(
      `ALTER TABLE "favorites_tracks" DROP CONSTRAINT "FK_favorites_tracks_track"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_tracks" DROP CONSTRAINT "FK_favorites_tracks_favorites"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_albums" DROP CONSTRAINT "FK_favorites_albums_album"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_albums" DROP CONSTRAINT "FK_favorites_albums_favorites"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_artists" DROP CONSTRAINT "FK_favorites_artists_artist"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorites_artists" DROP CONSTRAINT "FK_favorites_artists_favorites"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_tracks_album"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tracks" DROP CONSTRAINT "FK_tracks_artist"`,
    );
    await queryRunner.query(
      `ALTER TABLE "albums" DROP CONSTRAINT "FK_albums_artist"`,
    );

    // Drop tables
    await queryRunner.query(`DROP TABLE "favorites_tracks"`);
    await queryRunner.query(`DROP TABLE "favorites_albums"`);
    await queryRunner.query(`DROP TABLE "favorites_artists"`);
    await queryRunner.query(`DROP TABLE "favorites"`);
    await queryRunner.query(`DROP TABLE "tracks"`);
    await queryRunner.query(`DROP TABLE "albums"`);
    await queryRunner.query(`DROP TABLE "artists"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
