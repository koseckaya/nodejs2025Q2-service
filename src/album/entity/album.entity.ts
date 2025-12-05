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
  JoinColumn,
} from 'typeorm';
import { Artist } from '../../artist/entity/artist.entity';
import { Track } from '../../track/entity/track.entity';
import { Expose } from 'class-transformer';

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @Expose()
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  @Expose()
  name: string;

  @Column()
  @IsInt()
  @IsPositive()
  @IsNotEmpty({ message: ERROR_MSG.ALBUM_CREATE_INVALID_DATA })
  @Expose()
  year: number;

  @ManyToOne(() => Artist, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'artistId' })
  artist: Artist;

  @Column({ nullable: true })
  @Expose()
  artistId: string;

  @OneToMany(() => Track, (track) => track.album)
  tracks: Track[];
}
