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
    name: 'favorites_artists',
    joinColumn: { name: 'favorites_id' },
    inverseJoinColumn: { name: 'artist_id' },
  })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: { name: 'favorites_id' },
    inverseJoinColumn: { name: 'album_id' },
  })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: { name: 'favorites_id' },
    inverseJoinColumn: { name: 'track_id' },
  })
  @IsArray()
  @IsNotEmpty()
  @Expose()
  tracks: Track[];
}
