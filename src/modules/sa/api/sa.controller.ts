import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateQuestionDto } from './input-dtos/create-Question-Dto-Model';
import { CreateQuestionCommand } from '../application/use-cases/create-question-command';
import { QuestionForSaViewModel } from '../infrastructure/query-reposirory/question-for-sa-view-model';
import { DeleteQuestionCommand } from '../application/use-cases/delete-question-command';
import { UpdateQuestionCommand } from '../application/use-cases/update-question-command';
import { PublisherQuestionDto } from './input-dtos/publisher-question-Dto-Model';
import { PublishQuestionCommand } from '../application/use-cases/publish-question-command';
import { PaginationQuestionDto } from './input-dtos/pagination-Question-Dto';
import { QuestionQueryRepository } from '../infrastructure/query-reposirory/question-query.reposit';
import { PaginationViewModel } from '../../../main/common/pagination-View-Model';
import { ValidateUuidPipe } from '../../../main/validators/id-validation-pipe';
import { BasicAuthGuard } from '../../../main/guards/basic-auth.guard';
import { QuizQueryRepositories } from '../../quiz/infrastructure/query-repository/quiz-query-repositories';

// @UseGuards(BasicAuthGuard)
@Controller(`sa`)
export class SaController {
  constructor(
    private readonly questionQueryRepo: QuestionQueryRepository,
    private readonly quizQueryRepo: QuizQueryRepositories,
    private commandBus: CommandBus,
  ) {}

  @Get(`quiz/questions`)
  async getQuestions(
    @Query() paginationInputModel: PaginationQuestionDto,
  ): Promise<PaginationViewModel<QuestionForSaViewModel[]>> {
    return await this.questionQueryRepo.getQuestions(paginationInputModel);
  }

  @Post(`quiz/questions`)
  async createQuestion(
    @Body() questionInputModel: CreateQuestionDto,
  ): Promise<QuestionForSaViewModel> {
    return this.commandBus.execute(new CreateQuestionCommand(questionInputModel));
  }

  @HttpCode(204)
  @Delete(`quiz/questions/:id`)
  async deleteQuestion(@Param(`id`, ValidateUuidPipe) id: string): Promise<boolean> {
    return await this.commandBus.execute(new DeleteQuestionCommand(id));
  }

  @HttpCode(204)
  @Put(`quiz/questions/:id`)
  async updateQuestion(
    @Body() questionInputModel: CreateQuestionDto,
    @Param(`id`, ValidateUuidPipe) id: string,
  ): Promise<boolean> {
    return this.commandBus.execute(new UpdateQuestionCommand(id, questionInputModel));
  }

  @HttpCode(204)
  @Put(`quiz/questions/:id/publish`)
  async publishQuestion(
    @Param(`id`, ValidateUuidPipe) id: string,
    @Body() publishInputModel: PublisherQuestionDto,
  ): Promise<boolean> {
    return this.commandBus.execute(new PublishQuestionCommand(id, publishInputModel));
  }

  @Get(`game`)
  async game() {
    const gameId = '6777e55c-8700-40e8-953e-83a01b580a6b';
    return await this.quizQueryRepo.mappedSecondPlayerForView(gameId);
  }
}
