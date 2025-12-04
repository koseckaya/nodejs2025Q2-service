import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ERROR_MSG } from 'src/constants';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity';
import { Track } from '../../track/entity/track.entity';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  name: string;

  @Column()
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  year: number;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  artist: Artist;

  @Column({ nullable: true })
  artistId: string;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}
