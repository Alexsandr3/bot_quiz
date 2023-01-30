import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionRepository } from '../../../infrastructure/question.reposit';
import { PublishQuestionCommand } from '../publish-question-command';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(PublishQuestionCommand)
export class PublishQuestionHandler implements ICommandHandler<PublishQuestionCommand> {
  constructor(private readonly questionRepo: QuestionRepository) {}

  async execute(command: PublishQuestionCommand): Promise<boolean> {
    const { published } = command.questionInputModel;
    const id = command.id;
    const question = await this.questionRepo.findQuestionByIdWithMapped(id);
    if (!question) throw new NotFoundException(`Not found question with id: ${id}`);
    question.publisher(published);
    await this.questionRepo.saveQuestion(question);
    return true;
  }
}
