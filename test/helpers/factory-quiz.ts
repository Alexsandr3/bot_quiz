import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { endpoints } from './routing';
import { QuestionForSaViewModel } from '../../src/modules/sa/infrastructure/query-reposirory/question-for-sa-view-model';
import { CreateQuestionDto } from '../../src/modules/sa/api/input-dtos/create-Question-Dto-Model';
import { FactoryT, superUser } from './factory-t';

export class FactoryQuiz extends FactoryT {
  async createQuestion(count: number, app: INestApplication) {
    const result: { question: QuestionForSaViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const inputModel: CreateQuestionDto = {
        body: `Как называют снеговика в Польше? ${i}${i}`,
        correctAnswers: ['баба', 'бауван', 'снеговик', 'колобок'],
      };
      const responseBlog = await request(app.getHttpServer())
        .post(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .send(inputModel)
        .expect(201)
        .then(({ body }) => {
          console.log(body);
          expect(body).toEqual({
            id: expect.any(String),
            body: `Как называют снеговика в Польше? ${i}${i}`,
            correctAnswers: expect.any(Array), // [ 'баба', 'бауван', 'снеговик', 'колобок' ],
            published: false,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
          });
          result.push({ question: body });
        });
      // result.push({ question: responseBlog.body });
    }
    return result;
  }

  async createWithQuestion(
    count: number,
    question: string,
    answers: string[],
    app: INestApplication,
  ) {
    const result: { question: QuestionForSaViewModel }[] = [];
    for (let i = 0; i < count; i++) {
      const inputModel: CreateQuestionDto = {
        body: `${question}`,
        correctAnswers: answers,
      };
      const response = await request(app.getHttpServer())
        .post(endpoints.saController.quiz)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .send(inputModel)
        .expect(201);
      await request(app.getHttpServer())
        .put(endpoints.saController.quiz + `/${response.body.id}/publish`)
        .auth(superUser.login, superUser.password, { type: 'basic' })
        .send({ published: true })
        .expect(204);
      result.push({ question: response.body });
    }
    return result;
  }

  async connection(accessToken: string, app: INestApplication) {
    const res = await request(app.getHttpServer())
      .post(endpoints.quizController.connection)
      .auth(accessToken, { type: 'bearer' })
      .expect(200);
    return res.body;
  }

  async answer(value: string, accessToken: string, app: INestApplication) {
    const response = await request(app.getHttpServer())
      .post(endpoints.quizController.answer)
      .auth(accessToken, { type: 'bearer' })
      .send({
        answer: value,
      })
      .expect(200);
    return response.body;
  }
}
