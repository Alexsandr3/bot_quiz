import { Module } from '@nestjs/common';
import { AppUpdate } from './modules/users/app.update';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConfigType, getConfiguration } from './main/config/configuration';
import { TelegrafModule } from 'nestjs-telegraf';
import * as LocalSession from 'telegraf-session-local';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepositories } from './modules/users/repositories/users-repositories';
import { User } from './entities/user.entity';
import { UsersController } from './modules/users/users.controller';
import { TestingModule } from './modules/testing/testing.module';
import { Task } from './entities/task.entity';
import { BasicAuthGuard } from './main/guards/basic-auth.guard';
import { BasicStrategy } from './main/strategies/basic.strategy';
import { Question } from './entities/question.entity';
import { Player } from './entities/player.entity';
import { Answer } from './entities/answer.entity';
import { Game } from './entities/game.entity';
import { QuizRepositories } from './modules/quiz/infrastructure/quiz-repositories';
import { ConnectionQuizUseCase } from './modules/quiz/application/use-case/handlers/connection-quiz-use-case.service';
import { QuizQueryRepositories } from './modules/quiz/infrastructure/query-repository/quiz-query-repositories';
import { AnswerQuizUseCase } from './modules/quiz/application/use-case/handlers/answer-quiz-handler';
import { SaController } from './modules/sa/api/sa.controller';
import { CreateQuestionHandler } from './modules/sa/application/use-cases/handlers/create-question-handler';
import { DeleteQuestionHandler } from './modules/sa/application/use-cases/handlers/delete-question-handler';
import { PublishQuestionHandler } from './modules/sa/application/use-cases/handlers/publish-question-handler';
import { UpdateQuestionHandler } from './modules/sa/application/use-cases/handlers/update-question-handler';
import { QuestionRepository } from './modules/sa/infrastructure/question.reposit';
import { QuestionQueryRepository } from './modules/sa/infrastructure/query-reposirory/question-query.reposit';
import { CqrsModule } from '@nestjs/cqrs';
import { TestingController } from './modules/testing/testins.controller';

const handlers = [
  ConnectionQuizUseCase,
  AnswerQuizUseCase,
  CreateQuestionHandler,
  DeleteQuestionHandler,
  PublishQuestionHandler,
  UpdateQuestionHandler,
];
const providers = [AppService, BasicStrategy];
const guards = [BasicAuthGuard];
const controllers = [UsersController, SaController];
const repository = [
  UsersRepositories,
  QuizRepositories,
  QuizQueryRepositories,
  QuestionRepository,
  QuestionQueryRepository,
];
const session = new LocalSession({ database: 'session_db.json' });
const entities = [User, Task, Question, Game, Player, Answer];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [getConfiguration] }),
    TelegrafModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const token = configService.get('tokens', { infer: true });
        return {
          middlewares: [session.middleware()],
          token: token.TOKEN_TELEGRAM,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      // imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<ConfigType>) => {
        const database = configService.get('database', { infer: true });
        return {
          type: 'postgres',
          entities: [...entities],
          url: database.PGSQL_ELEPHANT_URI,
          autoLoadEntities: true,
          synchronize: true,
          // ssl: true,
        };
      },
    }),
    TypeOrmModule.forFeature([...entities]),
    CqrsModule,
    TestingModule,
  ],
  controllers: [...controllers],
  providers: [AppService, AppUpdate, ...repository, ...guards, ...handlers, ...providers],
})
export class AppModule {}
