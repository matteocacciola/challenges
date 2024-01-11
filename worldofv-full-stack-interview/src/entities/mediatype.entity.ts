import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('MediaType')
export class MediaType {
  @PrimaryGeneratedColumn()
  MediaTypeId: number;

  @Column({ type: 'nvarchar', length: 120, nullable: false })
  Name: string;
}
