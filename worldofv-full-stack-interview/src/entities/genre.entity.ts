import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('Genre')
export class Genre {
  @PrimaryGeneratedColumn()
  GenreId: number;

  @Column({ type: 'nvarchar', length: 120, nullable: false })
  Name: string;
}
