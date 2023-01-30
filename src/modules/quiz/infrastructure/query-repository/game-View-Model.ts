import { GameStatusesType } from '../../../../entities/game.entity';
import { AnswerStatusesType } from '../../../../entities/answer.entity';

export class GameViewModel {
  constructor(
    public id: string,
    public firstPlayerId: number,
    public secondPlayerId: number,
    public firstPlayerProgress: GamePlayerProgressViewModel,
    public secondPlayerProgress: GamePlayerProgressViewModel,
    public questions: QuestionShortViewModel[],
    public status: GameStatusesType,
    public pairCreatedDate: string,
    public startGameDate: string,
    public finishGameDate: string,
  ) {}
}

export class GamePlayerProgressViewModel {
  constructor(
    public answers: AnswerViewModel[],
    public player: PLayerViewModel,
    public score: number,
  ) {}
}

export class QuestionShortViewModel {
  constructor(public id: string, public body: string) {}
}

export class AnswerViewModel {
  constructor(
    public questionId: string,
    public answerStatus: AnswerStatusesType,
    public addedAt: string,
  ) {}
}

export class PLayerViewModel {
  constructor(public id: number, public firstName: string) {}
}
