import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from '../../../entities/question.entity';

@Injectable()
export class QuestionRepository {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async saveQuestion(createdQuestion: Question): Promise<string> {
    const question = await this.questionRepo.save(createdQuestion);
    return question.id;
  }

  async findQuestionByIdWithMapped(id: string): Promise<Question> {
    const question = await this.questionRepo.findOneBy({ id: id });
    if (!question) return null;
    return question;
  }

  async deleteQuestion(id: string): Promise<boolean> {
    await this.questionRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Question, {
          id: id,
        });
      })
      .catch((e) => {
        return console.log(e);
      });
    return true;
  }
}
