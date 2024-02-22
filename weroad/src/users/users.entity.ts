import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  Index,
} from 'typeorm';
import { Role } from '../roles/roles.entity';
import { IsEmail, Length } from 'class-validator';
import { Exclude } from 'class-transformer';
import { encrypt } from '../app.helpers';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'varchar', length: 160, nullable: false, unique: true })
  @IsEmail()
  email: string;

  @Exclude()
  @Length(6, 200)
  @Column({ type: 'varchar', length: 160, nullable: false })
  password: string;

  @ManyToMany(() => Role, { eager: true, orphanedRowAction: 'delete' })
  @JoinTable()
  roles: Role[];

  @BeforeInsert()
  async hashedPassword() {
    this.password = await encrypt(this.password);
  }
}
