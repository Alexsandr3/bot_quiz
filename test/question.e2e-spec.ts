import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { FactoryQuiz } from './helpers/factory-quiz';
import { createdApp } from '../src/main/helpers/createdApp';

jest.setTimeout(1200000);

describe(`Quiz `, () => {
  let app: INestApplication;

  beforeAll(async () => {
    // Create a NestJS application
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = module.createNestApplication();
    //created me
    app = createdApp(app);
    // Connect to the in-memory server
    await app.init();
  });
  afterAll(async () => {
    await app.close();
  });

  describe(`24 -  Access right for game flow`, () => {
    const quiz = new FactoryQuiz();

    it(`00 - DELETE -> "/testing/all-data": should remove all data; status 204;`, async () => {
      await request(app.getHttpServer()).delete(endpoints.testingController).expect(204);
    });
    it(`01 - GET -> "/pair-game-quiz/pairs/:id": create new game by user1, get game by user2. Should return error if current user tries to get pair in which not participated; status 403; used additional methods: DELETE -> /testing/all-data, POST -> /sa/users, POST -> /auth/login, POST -> /sa/quiz/questions, PUT -> /sa/quiz/questions/:questionId/publish, POST -> /pair-game-quiz/pairs/connection;`, async () => {
      await quiz.createWithQuestion(
        1,
        'Сколько углов в прямоугольном треугольнике?',
        ['3', 'три'],
        app,
      );
      await quiz.createWithQuestion(1, 'Каким цветом квадрат  Малевича?', ['черный'], app);
      await quiz.createWithQuestion(1, 'Как зовут в Польше снеговика?', ['бауван'], app);
    });
  });
});
