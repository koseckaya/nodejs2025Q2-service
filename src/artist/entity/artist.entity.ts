import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ERROR_MSG } from 'src/constants';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Album } from '../../album/entity/album.entity';
import { Track } from '../../track/entity/track.entity';
import { Expose } from 'class-transformer';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID(4)
  @Expose()
  id: string;

  @Column()
  @IsString()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  @Expose()
  name: string;

  @Column()
  @IsBoolean()
  @IsNotEmpty({ message: ERROR_MSG.ARTIST_CREATE_INVALID_DATA })
  @Expose()
  grammy: boolean;

  @OneToMany(() => Album, (album) => album.artist)
  @Expose()
  albums: Album[];

  @OneToMany(() => Track, (track) => track.artist)
  @Expose()
  tracks: Track[];
}
