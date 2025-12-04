import { IsArray, IsNotEmpty } from 'class-validator';
import { Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';
import { Track } from '../../track/entity/track.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'favorites_artists',
    joinColumn: { name: 'favorites_id' },
    inverseJoinColumn: { name: 'artist_id' },
  })
  @IsArray()
  @IsNotEmpty()
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: { name: 'favorites_id' },
    inverseJoinColumn: { name: 'album_id' },
  })
  @IsArray()
  @IsNotEmpty()
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: { name: 'favorites_id' },
    inverseJoinColumn: { name: 'track_id' },
  })
  @IsArray()
  @IsNotEmpty()
  tracks: Track[];
}
