import {
  Column,
  Entity, ManyToOne, PrimaryColumn,
  PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./user.entity";


@Entity()
export class Task {
  @PrimaryColumn()
  id: number;
  @Column({ type: "text" })
  idTelegram: number;
  @Column({ type: "text" })
  title: string;
  @Column({ type: "boolean", default: false })
  isCompleted: boolean;
  @ManyToOne(() => User, (u) => u.tasks)
  user: User;

  constructor(id: number, idTelegram: number, title: string, user: User) {
    this.id = id;
    this.idTelegram = idTelegram;
    this.title = title;
    this.user = user;
  }

  static createTask(id: number, idTelegram: number, title: string, user: User) {
    return new Task(id, idTelegram, title, user);
  }

  updateTask(title: string){
    this.title = title
  }

  isCompletedTask(){
    this.isCompleted = !this.isCompleted
  }


}
