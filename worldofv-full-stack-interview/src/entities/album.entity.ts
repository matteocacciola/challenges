import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Artist } from './artist.entity';
import { Track } from './track.entity';

@Entity('Album')
export class Album {
  @PrimaryGeneratedColumn()
  AlbumId: number;

  @Column({ type: 'nvarchar', length: 160, nullable: false })
  Title: string;

  @ManyToOne(() => Artist, (artist) => artist.Albums, { eager: true })
  @JoinColumn([{ name: 'ArtistId', referencedColumnName: 'ArtistId' }])
  Artist: Artist;

  @OneToMany(() => Track, (track) => track.Album)
  Tracks: Track[];
}
