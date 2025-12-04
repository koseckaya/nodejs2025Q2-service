import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ERROR_MSG } from 'src/constants';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from '../../album/entity/album.entity';
import { Track } from '../../track/entity/track.entity';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  name: string;

  @Column({ nullable: true })
  @IsBoolean()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  tracks: Track[];
}
