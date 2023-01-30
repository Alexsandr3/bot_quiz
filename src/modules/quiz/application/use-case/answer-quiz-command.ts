import { AnswerDto } from '../../api/input-dtos/answer-Dto-Model';

export class AnswerQuizCommand {
  constructor(
    public readonly userId: string,
    public readonly inputAnswerModel: AnswerDto,
  ) {}
}
