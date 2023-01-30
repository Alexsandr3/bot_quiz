import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from './task.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  idTelegram: number;
  @Column({ type: 'text' })
  firstName: string;
  @Column({ type: 'text', default: null })
  lastName: string;
  @Column({ type: 'timestamptz', default: new Date() })
  createdAt: Date;
  @OneToMany(() => Task, (d) => d.user)
  tasks: Task[];

  constructor(idTelegram: number, firstName: string, lastName?: string) {
    this.idTelegram = idTelegram;
    this.firstName = firstName;
    this.lastName = firstName;
  }

  static createUser(idTelegram: number, firstName: string, lastName?: string) {
    return new User(idTelegram, firstName, lastName);
  }
}
