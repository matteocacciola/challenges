import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  AfterLoad,
  AfterInsert,
  AfterUpdate,
} from 'typeorm';
import { Mood } from './travels.enums';
import { Tour } from '../tours/tours.entity';

@Entity('travels')
export class Travel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'bool', nullable: false })
  isPublic: boolean;

  @Column({ type: 'varchar', length: 255, nullable: false })
  slug: string;

  @Column({ type: 'varchar', length: 255, nullable: false, unique: true })
  name: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'int', nullable: false })
  numberOfDays: number;

  numberOfNights: number;

  @Column({ type: 'json', nullable: false })
  moods: { [key in Mood]: number } = {
    [Mood.NATURE]: 0,
    [Mood.RELAX]: 0,
    [Mood.HISTORY]: 0,
    [Mood.CULTURE]: 0,
    [Mood.PARTY]: 0,
  };

  @OneToMany(() => Tour, (tour) => tour.travel, {
    eager: false,
    cascade: true,
    onDelete: 'CASCADE',
  })
  tours: Tour[];

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async loaded() {
    this.numberOfNights = this.numberOfDays - 1;
  }
}
