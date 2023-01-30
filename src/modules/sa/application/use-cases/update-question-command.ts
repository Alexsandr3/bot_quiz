import { CreateQuestionDto } from '../../api/input-dtos/create-Question-Dto-Model';

export class UpdateQuestionCommand {
  constructor(
    public readonly id: string,
    public readonly questionInputModel: CreateQuestionDto,
  ) {}
}
