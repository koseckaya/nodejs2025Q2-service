import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity';
import { Album } from '../../album/entity/album.entity';

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string;

  @ManyToOne(() => Album, { nullable: true, onDelete: 'SET NULL' })
  album: Album;

  @Column({ nullable: true })
  albumId: string;

  @Column()
  duration: number;
}
