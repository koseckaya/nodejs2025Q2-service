import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateFavoritesNames1764969308787 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Rename favorites_artists table and its columns
    await queryRunner.query(
      `ALTER TABLE favorites_artists RENAME TO "favoritesArtists"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesArtists" RENAME COLUMN favorites_id TO "favoritesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesArtists" RENAME COLUMN artist_id TO "artistId"`,
    );

    // Rename favorites_albums table and its columns
    await queryRunner.query(
      `ALTER TABLE favorites_albums RENAME TO "favoritesAlbums"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesAlbums" RENAME COLUMN favorites_id TO "favoritesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesAlbums" RENAME COLUMN album_id TO "albumId"`,
    );

    // Rename favorites_tracks table and its columns
    await queryRunner.query(
      `ALTER TABLE favorites_tracks RENAME TO "favoritesTracks"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesTracks" RENAME COLUMN favorites_id TO "favoritesId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesTracks" RENAME COLUMN track_id TO "trackId"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert favorites_tracks table and its columns
    await queryRunner.query(
      `ALTER TABLE "favoritesTracks" RENAME COLUMN "trackId" TO track_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesTracks" RENAME COLUMN "favoritesId" TO favorites_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesTracks" RENAME TO favorites_tracks`,
    );

    // Revert favorites_albums table and its columns
    await queryRunner.query(
      `ALTER TABLE "favoritesAlbums" RENAME COLUMN "albumId" TO album_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesAlbums" RENAME COLUMN "favoritesId" TO favorites_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesAlbums" RENAME TO favorites_albums`,
    );

    // Revert favorites_artists table and its columns
    await queryRunner.query(
      `ALTER TABLE "favoritesArtists" RENAME COLUMN "artistId" TO artist_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesArtists" RENAME COLUMN "favoritesId" TO favorites_id`,
    );
    await queryRunner.query(
      `ALTER TABLE "favoritesArtists" RENAME TO favorites_artists`,
    );
  }
}
