import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Player {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: 'text' })
  userId: number;
  @Column({ type: 'uuid' })
  gameId: string;
  @Column({ type: 'character varying', length: 500, collation: 'C' })
  firstName: string;
  @Column({ type: 'int', default: 0 })
  score: number;
  @Column({ type: 'boolean', default: false })
  isAlert: boolean;
  @Column({ type: 'boolean', default: false })
  statusesPlayer: boolean;
  @OneToMany(() => Answer, (q) => q.player, { eager: true })
  answers: Answer[];

  constructor(idTelegram: number, gameId: string, firstName: string) {
    this.userId = idTelegram;
    this.gameId = gameId;
    this.firstName = firstName;
  }

  static createPlayer(idTelegram: number, gameId: string, firstName: string) {
    return new Player(idTelegram, gameId, firstName);
  }

  addPoint() {
    this.score += 1;
  }
  changeStatuses() {
    this.statusesPlayer = true;
  }

  alert() {
    this.isAlert = true;
  }
}
