import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';
import { Expose } from 'class-transformer';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column()
  @Expose()
  name: string;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artist_id' })
  artist: Artist;

  @Column({ name: 'artist_id', nullable: true })
  @Expose()
  artistId: string;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'album_id' })
  album: Album;

  @Column({ name: 'album_id', nullable: true })
  @Expose()
  albumId: string;

  @Column()
  @Expose()
  duration: number;
}
