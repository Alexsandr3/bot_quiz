import { CreateQuestionDto } from '../../api/input-dtos/create-Question-Dto-Model';

export class CreateQuestionCommand {
  constructor(public readonly questionInputModel: CreateQuestionDto) {}
}
