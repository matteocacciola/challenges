import {
  AfterInsert,
  AfterLoad,
  AfterUpdate,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Travel } from '../travels/travels.entity';

@Entity('tours')
export class Tour {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Travel, (travel) => travel.tours, { eager: false })
  travel: Travel;

  @Column({ type: 'varchar', length: 160, nullable: false, unique: true })
  name: string;

  @Column({ type: 'date', nullable: false })
  startingDate: Date;

  @Column({ type: 'date', nullable: false })
  endingDate: Date;

  @Column({ type: 'int', nullable: false })
  price: number;

  @BeforeInsert()
  @BeforeUpdate()
  async insertPrice() {
    this.price = Math.trunc(this.price * 100);
  }

  @AfterLoad()
  @AfterInsert()
  @AfterUpdate()
  async loaded() {
    this.startingDate = new Date(this.startingDate);
    this.endingDate = new Date(this.endingDate);
    this.price = this.price / 100;
  }
}
