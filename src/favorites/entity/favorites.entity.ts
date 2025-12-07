import { IsArray, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';
import { Track } from '../../track/entity/track.entity';
import { Expose } from 'class-transformer';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'favoritesArtists',
    joinColumn: { name: 'favoritesId' },
    inverseJoinColumn: { name: 'artistId' },
  })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'favoritesAlbums',
    joinColumn: { name: 'favoritesId' },
    inverseJoinColumn: { name: 'albumId' },
  })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'favoritesTracks',
    joinColumn: { name: 'favoritesId' },
    inverseJoinColumn: { name: 'trackId' },
  })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  tracks: Track[];
}
