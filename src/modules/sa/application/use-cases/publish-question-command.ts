import { PublisherQuestionDto } from '../../api/input-dtos/publisher-question-Dto-Model';

export class PublishQuestionCommand {
  constructor(
    public readonly id: string,
    public readonly questionInputModel: PublisherQuestionDto,
  ) {}
}
