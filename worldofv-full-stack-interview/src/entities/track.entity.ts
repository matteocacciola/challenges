import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from './album.entity';
import { Genre } from './genre.entity';
import { MediaType } from './mediatype.entity';

@Entity('Track')
export class Track {
  @PrimaryGeneratedColumn()
  TrackId: number;

  @Column({ type: 'nvarchar', length: 200, nullable: false })
  Name: string;

  @ManyToOne(() => Album, (album) => album.Tracks, { eager: true })
  @JoinColumn([{ name: 'AlbumId', referencedColumnName: 'AlbumId' }])
  Album: Album;

  @ManyToOne(() => MediaType, { eager: true })
  @JoinColumn([{ name: 'MediaTypeId', referencedColumnName: 'MediaTypeId' }])
  MediaType: MediaType;

  @ManyToOne(() => Genre, { eager: true })
  @JoinColumn([{ name: 'GenreId', referencedColumnName: 'GenreId' }])
  Genre: Genre;

  @Column({ type: 'nvarchar', length: 220 })
  Composer: string;

  @Column({ type: 'integer' })
  Milliseconds: number;

  @Column({ type: 'integer' })
  Bytes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  UnitPrice: number;
}
