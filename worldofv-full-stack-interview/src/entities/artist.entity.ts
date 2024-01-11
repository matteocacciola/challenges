import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Album } from './album.entity';

@Entity('Artist')
export class Artist {
  @PrimaryGeneratedColumn()
  ArtistId: number;

  @Column({ type: 'nvarchar', length: 120 })
  Name: string;

  @OneToMany(() => Album, (album) => album.Artist)
  Albums: Album[];
}
