import { Column, Entity, JoinColumn, ManyToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Player } from './player.entity';
import { Question } from './question.entity';

export enum GameStatusesType {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

@Entity()
export class Game {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'enum',
    enum: GameStatusesType,
    default: GameStatusesType.PendingSecondPlayer,
  })
  status: GameStatusesType;

  @Column({ type: 'timestamptz', default: null })
  pairCreatedDate: Date; //Date when first player initialized the pair
  @Column({ type: 'timestamptz', default: null })
  startGameDate: Date; //Game starts immediately after second player connection to this pair
  @Column({ type: 'timestamptz', default: null })
  finishGameDate: Date; //Game finishes immediately after both players have answered all the questions

  @Column({ type: 'text' })
  firstPlayerId: number;
  @Column({ type: 'text', default: null })
  secondPlayerId: number;

  @OneToOne(() => Player, { eager: true })
  @JoinColumn()
  firstPlayerProgress: Player;

  @OneToOne(() => Player, { eager: true })
  @JoinColumn()
  secondPlayerProgress: Player;

  @ManyToMany(() => Question, (q) => q.games)
  questions: Question[];

  constructor(questions: Question[], idTelegram: number) {
    this.questions = questions;
    this.firstPlayerId = idTelegram;
  }

  static createGame(questions: Question[], idTelegram: number) {
    return new Game(questions, idTelegram);
  }

  addFirstPlayer(player: Player) {
    this.firstPlayerProgress = player;
    this.pairCreatedDate = new Date();
    this.status = GameStatusesType.PendingSecondPlayer;
  }

  addSecondPlayer(player: Player, idTelegram: number) {
    this.secondPlayerProgress = player;
    this.startGameDate = new Date();
    this.status = GameStatusesType.Active;
    this.secondPlayerId = idTelegram;
  }

  finishDate() {
    this.status = GameStatusesType.Finished;
    this.finishGameDate = new Date();
  }
}
