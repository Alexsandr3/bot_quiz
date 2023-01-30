import { AppService } from '../../app.service';
import { Action, Ctx, InjectBot, Message, On, Start, Update } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { Context, TelegramUpdateMessage } from '../../main/types/context.interface';
import { UsersRepositories } from './repositories/users-repositories';
import {
  buttonsAnswers,
  buttonsGameMenu,
  buttonsMain,
  buttonsMenu,
  buttonsQuestions,
  buttonsToDo,
  buttonsToDo2,
} from '../../buttons/app.buttons';
import { User } from '../../entities/user.entity';
import { ConnectionQuizUseCase } from '../quiz/application/use-case/handlers/connection-quiz-use-case.service';
import { GameStatusesType } from '../../entities/game.entity';
import { AnswerQuizUseCase } from '../quiz/application/use-case/handlers/answer-quiz-handler';
import { showTasks } from '../../main/helpers/app.utilits';
import { Task } from '../../entities/task.entity';
import { QuizRepositories } from '../quiz/infrastructure/quiz-repositories';
import { AnswerStatusesType } from '../../entities/answer.entity';

@Update()
export class AppUpdate {
  constructor(
    @InjectBot() private readonly bot: Telegraf<Context>,
    private readonly appService: AppService,
    private readonly usersRepo: UsersRepositories,
    private readonly quizRepo: QuizRepositories,
    private readonly connectionQuizUseCase: ConnectionQuizUseCase,
    private readonly answerQuizUseCase: AnswerQuizUseCase,
  ) {}

  @Start()
  async startCommand(ctx: Context) {
    try {
      const idTelegram = ctx.from.id;
      const firstName = ctx.from.first_name;
      const lastName = ctx.from.last_name;
      const foundUser = await this.usersRepo.findUserById(idTelegram);
      if (!foundUser) {
        await ctx.replyWithHTML(
          '<b>Hi! \n\nMy good Friend 🦝</b>, \n\nWelcome to chat. 🗿',
          buttonsMain(),
        );
        const user = await User.createUser(idTelegram, firstName, lastName);
        await this.usersRepo.saveUser(user);
      } else {
        await ctx.replyWithHTML(
          `<b>Hi! 👋🏽</b> \n\nNice to meet you here: <b>${firstName}</b>`,
          buttonsMain(),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Action('main_menu')
  async mainMenu(ctx: Context) {
    try {
      const firstName = ctx.from.first_name;
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `Посмотри 👀 и выбири <b>${firstName}</b> что ты хочешь сделать: `,
        buttonsMenu(),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Action('game_menu')
  async gameMenu(ctx: Context) {
    try {
      const firstName = ctx.from.first_name;
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `<b>${firstName}</b> нажми на кнопку <b>🏁 Start</b> чтобы начать игру или посмотреть статистику.`,
        buttonsGameMenu(),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Action('todo_menu')
  async toDoMenu(ctx: Context) {
    try {
      const firstName = ctx.from.first_name;
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `<b>${firstName}</b> ты можешь запланировать и записать 🖊 что-то важное. \n\ А также откредактировть существующие задачи.`,
        Markup.inlineKeyboard([
          Markup.button.callback('📜 Список дел', 'tasks'),
          Markup.button.callback('🔙 Назад', 'back_menu'),
        ]),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Action('back_main_menu')
  async backStepMainMenu(ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(`Вернуться назад в главное меню`, buttonsMain());
    } catch (e) {
      console.log(e);
    }
  }

  @Action('back_game_menu')
  async backStepGameMenu(ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(`Вернуться назад в меню`, buttonsMenu());
    } catch (e) {
      console.log(e);
    }
  }

  @Action('back_menu')
  async backStepMenu(ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(`Вернуться назад в меню`, buttonsMenu());
    } catch (e) {
      console.log(e);
    }
  }

  @Action('back_todo_menu')
  async backStepTodoMenu(ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(`Вернуться назад в меню`, buttonsToDo());
    } catch (e) {
      console.log(e);
    }
  }

  @Action('tasks')
  async listTask(ctx: Context) {
    await ctx.deleteMessage();
    await ctx.answerCbQuery();
    const idTelegram = ctx.from.id;
    const listTasks = await this.usersRepo.findTask(idTelegram);
    if (!listTasks) {
      await ctx.replyWithHTML(
        `У тебя нет запланированных задач 👀`,
        Markup.inlineKeyboard([
          Markup.button.callback('📌 Добавить', 'add'),
          Markup.button.callback('🔙 Назад', 'back_menu'),
        ]),
      );
    } else {
      await ctx.replyWithHTML(showTasks(ctx, listTasks), buttonsToDo2());
    }
  }

  @Action('done')
  async doneTask(ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    ctx.session.type = 'done';
    await ctx.reply('Напиши ID задания:');
  }

  @Action('edit')
  async editTask(ctx: Context) {
    await ctx.answerCbQuery();
    ctx.session.type = 'edit';
    await ctx.deleteMessage();
    await ctx.replyWithHTML(
      'Напиши ID задания: и новое название задачи: \n\n' + 'В формате: <b>1_Новое название</b>',
    );
  }

  @Action('add')
  async addTask(ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    ctx.session.type = 'add';
    await ctx.replyWithHTML(
      'Напиши ID задания: и новое название задачи: \n\n' + 'В формате: <b>1_Новое название</b>',
    );
  }

  @Action('remove')
  async deleteTask(ctx: Context) {
    await ctx.answerCbQuery();
    await ctx.deleteMessage();
    ctx.session.type = 'remove';
    await ctx.reply('Напиши ID задания:');
  }

  @Action('start_game')
  async gameStart(ctx: Context) {
    try {
      const firstName = ctx.from.first_name;
      const idTelegram = ctx.from.id;
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      const activeGame = await this.quizRepo.findActiveAndPendingGameByUserId(idTelegram);
      if (activeGame) {
        await ctx.replyWithHTML(
          `<b>${firstName}</b> ты уже участвуешь в игре. \n\nОжидайте ⌛️ подключения второго игрока, игра создана ❌. \n\nИли завершите начатую игру`,
          buttonsQuestions(),
        );
        // await ctx.deleteMessage();
        return;
      }
      const game = await this.connectionQuizUseCase.execute(idTelegram, firstName);
      if (game.status === GameStatusesType.PendingSecondPlayer) {
        await ctx.replyWithHTML(`Ожидайте ⌛️ подключения второго игрока, игра создана ❌`);
      } else {
        await ctx.telegram.sendMessage(
          game.firstPlayerId,
          `${game.firstPlayerProgress.player.firstName} Игра началась! 🏁, лови вопросы`,
          Markup.inlineKeyboard(
            [
              Markup.button.callback('вопросы ⬇️', 'question'),
              Markup.button.callback('🔙 Сдаться 🏳️', 'back_game'),
            ],
            {
              columns: 1,
            },
          ),
        );
        await ctx.telegram.sendMessage(
          game.secondPlayerId,
          `${game.secondPlayerProgress.player.firstName} Игра началась! 🏁, лови вопросы`,
          Markup.inlineKeyboard(
            [
              Markup.button.callback('вопросы ⬇️', 'question'),
              Markup.button.callback('🔙 Сдаться 🏳️', 'back_game'),
            ],
            {
              columns: 1,
            },
          ),
        );
      }
    } catch (e) {
      console.log(e);
    }
  }

  @Action('info_game')
  async infoGames(ctx: Context) {
    try {
      const firstName = ctx.from.first_name;
      const idTelegram = ctx.from.id;
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      await ctx.replyWithHTML(
        `пока нету информации но в скором времени появиться`,
        buttonsQuestions(),
      );

      return;
    } catch (e) {
      console.log(e);
    }
  }

  @Action('question')
  async question(ctx: Context) {
    try {
      const idTelegram = ctx.from.id;
      const firstName = ctx.from.first_name;
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      const activeGame = await this.quizRepo.findActiveAndPendingGameByUserId(idTelegram);
      const player = await this.quizRepo.findPlayer(idTelegram, activeGame.id);
      if (player.answers.length === activeGame.questions.length) {
        await ctx.replyWithHTML(
          `${firstName} ты уже ответил на все вопросы ожидай результатов игры!`,
        );
      }
      //what question!
      const question = activeGame.questions[player.answers.length];
      await ctx.replyWithHTML(
        `Нажми на кнопку ниже или \n\nНапиши ответ на вопрос который появиться ниже, одним словом без пробелов. \n\n<b>Вопрос:</b>\n\n<b>${question.body}</b>`,
        buttonsAnswers(),
      );
    } catch (e) {
      console.log(e);
    }
  }

  @Action('answers')
  async answers(ctx: Context) {
    try {
      await ctx.answerCbQuery();
      await ctx.deleteMessage();
      ctx.session.type = 'answers';
      await ctx.replyWithHTML('Напиши ответ одним словом без пробелов');
    } catch (e) {
      console.log(e);
    }
  }

  @On('text')
  async getMessage(
    @Message('text') message: string,
    @Ctx() ctx: Context,
    @Ctx() payload: TelegramUpdateMessage,
  ) {
    try {
      if (!ctx.session.type) return;
      const idTelegram = ctx.from.id;
      const firstName = ctx.from.first_name;
      if (
        payload.message.text.toLowerCase().includes('привет') ||
        payload.message.text.toLowerCase().includes('hi') ||
        payload.message.text.toLowerCase().includes('hello')
      ) {
        await ctx.deleteMessage();
        await ctx.replyWithHTML(`Hi! My good Friend -- <b>${payload.message.from.first_name}</b>`);
        return;
      }
      if (
        payload.message.text.toLowerCase().includes('игра') ||
        payload.message.text.toLowerCase().includes('game')
      ) {
        await ctx.deleteMessage();
        await ctx.replyWithHTML(`Игра <b>начинается!</b>`, buttonsGameMenu());
        return;
      }
      const [taskId, title] = message.split('_');
      if (!taskId) {
        await ctx.replyWithHTML(`<b>Sorry, Я тупаватый бот 🤖.</b>`);
        return;
      }

      if (ctx.session.type === 'answers') {
        const answer = payload.message.text.toLowerCase();
        const gameActive = await this.quizRepo.findActiveGameByUserId(idTelegram);
        const answerView = await this.answerQuizUseCase.execute(idTelegram, answer);
        if (answerView.answerStatus === AnswerStatusesType.Correct) {
          await ctx.replyWithHTML(
            `<b>${firstName}</b> этот ответ <b>правильный! 🎉🎉🎉🎉</b>`,
            buttonsQuestions(),
          );
        }
        if (answerView.answerStatus === AnswerStatusesType.Incorrect) {
          await ctx.replyWithHTML(
            `<b>${firstName}</b> этот ответ <b>неверный ☹️☹️☹️</b>`,
            buttonsQuestions(),
          );
        }
        const game = await this.quizRepo.findFinishedByUserId(idTelegram, gameActive.id);
        //checking the finish game!
        if (
          game.firstPlayerProgress.answers.length === 5 &&
          game.firstPlayerProgress.isAlert === false
        ) {
          await ctx.telegram.sendMessage(
            game.firstPlayerId,
            `${firstName} ты уже ответил на все вопросы ожидай результатов игры! Как только твой соперник ответит на все вопросы ты узнаешь результат.`,
          );
          const firstPlayer = await this.quizRepo.findPlayerForAlert(game.firstPlayerId, game.id);
          firstPlayer.alert();
          await this.quizRepo.savePlayer(firstPlayer);
        }
        if (
          game.secondPlayerProgress.answers.length === 5 &&
          game.secondPlayerProgress.isAlert === false
        ) {
          await ctx.telegram.sendMessage(
            game.secondPlayerId,
            `${firstName} ты уже ответил на все вопросы ожидай результатов игры! Как только твой соперник ответит на все вопросы ты узнаешь результат.`,
          );
          const secondPlayer = await this.quizRepo.findPlayerForAlert(game.secondPlayerId, game.id);
          secondPlayer.alert();
          await this.quizRepo.savePlayer(secondPlayer);
        }
        if (
          game.firstPlayerProgress.answers.length === 5 &&
          game.secondPlayerProgress.answers.length === 5
        ) {
          const firstPlayer = await this.quizRepo.findPlayerForAlert(game.firstPlayerId, game.id);
          const secondPlayer = await this.quizRepo.findPlayerForAlert(game.secondPlayerId, game.id);
          if (firstPlayer.score > secondPlayer.score) {
            await ctx.telegram.sendMessage(
              game.firstPlayerId,
              `${firstPlayer.firstName} ты выйграл молодчина так держать 🎉🎉🎉🎉🎉! Ты набрал: ${firstPlayer.score} points. А твой соперник получил: ${secondPlayer.score} points.`,
              buttonsGameMenu(),
            );
            await ctx.telegram.sendMessage(
              game.secondPlayerId,
              `${secondPlayer.firstName} победа была рядом но твой соперник больше набрал очков. Ты набрал: ${secondPlayer.score} points. А твой соперник получил: ${firstPlayer.score} points.`,
              buttonsGameMenu(),
            );
            return;
          }
          if (firstPlayer.score < secondPlayer.score) {
            await ctx.telegram.sendMessage(
              game.secondPlayerId,
              `${secondPlayer.firstName} ты выйграл молодчина так держать 🎉🎉🎉🎉🎉! Ты набрал: ${secondPlayer.score} points. А твой соперник получил: ${firstPlayer.score} points.`,
              buttonsGameMenu(),
            );
            await ctx.telegram.sendMessage(
              game.firstPlayerId,
              `${firstPlayer.firstName} победа была рядом но твой соперник больше набрал очков.  Ты набрал: ${firstPlayer.score} points. А твой соперник получил: ${secondPlayer.score} points.`,
              buttonsGameMenu(),
            );
            return;
          }
          if (firstPlayer.score === secondPlayer.score) {
            await ctx.telegram.sendMessage(
              game.firstPlayerId,
              `${firstPlayer.firstName} ты набрал одинаковое число очков как и твой соперник. В следующей игре соберись и победи. Ты набрал: ${firstPlayer.score} points. А твой соперник получил: ${secondPlayer.score} points.`,
              buttonsGameMenu(),
            );
            await ctx.telegram.sendMessage(
              game.secondPlayerId,
              `${secondPlayer.firstName} ты набрал одинаковое число очков как и твой соперник. В следующей игре соберись и победи. Ты набрал: ${firstPlayer.score} points. А твой соперник получил: ${secondPlayer.score} points.`,
              buttonsGameMenu(),
            );
            return;
          }
          return;
        }
        return;
      }
      if (ctx.session.type === 'remove') {
        // await ctx.deleteMessage();
        const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
        if (!task) {
          await ctx.deleteMessage();
          await ctx.reply(`Не найдено такого задания с id: ${message}`, buttonsToDo2());
          return;
        }
        await this.usersRepo.deleteTask(Number(taskId));
        const todos = await this.usersRepo.findTask(idTelegram);
        if (!todos) {
          await ctx.deleteMessage();
          await ctx.replyWithHTML(
            `<b>У тебя нет запланированных задач 📝</b>`,
            Markup.inlineKeyboard(
              [
                Markup.button.callback('📌 Добавить', 'add'),
                Markup.button.callback('🔙 Назад в главное меню', 'back_menu'),
              ],
              {
                columns: 1,
              },
            ),
          );
          return;
        }
        await ctx.replyWithHTML(showTasks(ctx, todos), buttonsToDo2());
        return;
      }
      if (ctx.session.type === 'done') {
        await ctx.deleteMessage();
        const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
        if (!task) {
          await ctx.replyWithHTML(
            `<b>Не найдено такого задания с id_</b>${message}. \n\nНапиши коректный id :)`,
            buttonsToDo2(),
          );
          return;
        }
        task.isCompletedTask();
        await this.usersRepo.saveTask(task);
        const todos = await this.usersRepo.findTask(idTelegram);
        await ctx.replyWithHTML(showTasks(ctx, todos), buttonsToDo2());
        return;
      }
      if (!title) {
        await ctx.deleteMessage();
        await ctx.replyWithHTML(
          `<b>Sorry</b>, я тупаватый бот 🤖. \n\n     Введите корректные данные`,
        );
        return;
      }
      if (ctx.session.type === 'add') {
        await ctx.deleteMessage();
        const user = await this.usersRepo.findUserById(idTelegram);
        const task = Task.createTask(Number(taskId), idTelegram, title, user);
        await this.usersRepo.saveTask(task);
        const todo = await this.usersRepo.findTask(idTelegram);
        if (!todo) {
          await ctx.deleteMessage();
          await ctx.reply(`Не найдено такого задания с id: ${message}`, buttonsToDo2());
          return;
        }
        await ctx.replyWithHTML(showTasks(ctx, todo), buttonsToDo2());
        return;
      }
      if (ctx.session.type === 'edit') {
        await ctx.deleteMessage();
        const task = await this.usersRepo.findTaskByIdTask(Number(taskId));
        if (!task) {
          await ctx.deleteMessage();
          await ctx.reply(`Не найдено такого задания с id: ${message}`, buttonsToDo2());
          return;
        }
        task.updateTask(title);
        await this.usersRepo.saveTask(task);
        const todos = await this.usersRepo.findTask(idTelegram);
        await ctx.replyWithHTML(showTasks(ctx, todos), buttonsToDo2());
        return;
      }
      return;
    } catch (e) {
      // await ctx.replyWithHTML(`<b>Sorry, Я тупаватый бот 🤖. ты что-то делаешь не так)))</b>`);
      console.log(e);
    }
  }
}
