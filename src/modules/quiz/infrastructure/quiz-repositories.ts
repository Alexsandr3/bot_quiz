import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game, GameStatusesType } from '../../../entities/game.entity';
import { Player } from '../../../entities/player.entity';
import { Question } from '../../../entities/question.entity';
import { Answer, AnswerStatusesType } from '../../../entities/answer.entity';

export class QuizRepositories {
  constructor(
    @InjectRepository(Game) private readonly gameRepo: Repository<Game>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>,
    @InjectRepository(Answer) private readonly answerRepo: Repository<Answer>,
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async saveGame(createdGame: Game): Promise<Game> {
    return this.gameRepo.save(createdGame);
  }

  async savePlayer(createdPlayer: Player): Promise<Player> {
    return this.playerRepo.save(createdPlayer);
  }

  async saveAnswer(createdAnswer: Answer): Promise<Answer> {
    return this.answerRepo.save(createdAnswer);
  }

  //get
  /*  async findCurrentGame(userId: string): Promise<Game> {
    return await this.gameRepo.findOne({
      select: ['id', 'status'],
      where: [
        {
          status: GameStatusesType.Active,
          firstPlayerId: userId,
        },
        {
          status: GameStatusesType.Active,
          secondPlayerId: userId,
        },
        {
          status: GameStatusesType.PendingSecondPlayer,
          firstPlayerId: userId,
        },
      ],
    });
    // .catch((e) => {
    //   return null;
    // });
    // console.log(games);
    // if (games.length === 0) return null;
    // return true;
  }

  async findGame(gameId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: ['id', 'firstPlayerId', 'secondPlayerId'],
      where: { id: gameId },
    });
    if (!game) return null;
    return game;
  }*/
  async findGames(idTelegram: number): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: { firstPlayerProgress: true, secondPlayerProgress: true, questions: true },
      where: [
        { status: GameStatusesType.Finished, firstPlayerId: idTelegram },
        { status: GameStatusesType.Finished, secondPlayerId: idTelegram },
      ],
    });
    if (!game) return null;
    return game;
  }

  //connection
  async findPendingGame(): Promise<Game> {
    const game = await this.gameRepo.findOne({
      where: { status: GameStatusesType.PendingSecondPlayer },
    });
    if (!game) return null;
    return game;
  }

  async findActiveAndPendingGameByUserId(idTelegram: number): Promise<Game> {
    const game = await this.gameRepo.findOne({
      relations: {
        firstPlayerProgress: true,
        secondPlayerProgress: true,
        questions: true,
      },
      where: [
        { status: GameStatusesType.Active, firstPlayerId: idTelegram },
        { status: GameStatusesType.Active, secondPlayerId: idTelegram },
        {
          status: GameStatusesType.PendingSecondPlayer,
          firstPlayerId: idTelegram,
        },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findQuestions(): Promise<Question[]> {
    return this.questionRepo.find({
      select: ['id', 'body'],
      where: { published: true },
      // order: { createdAt: 'ASC' },
      take: 5,
    });
    // .createQueryBuilder('q')
    // .select(['q.id, q.body'])
    // .orderBy('RANDOM()')
    // .take(5)
    // .getMany();
  }

  //answer
  async findActiveGameByUserId(idTelegram: number): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: {
        firstPlayerProgress: true,
        secondPlayerProgress: true,
        questions: true,
      },
      where: [
        { status: GameStatusesType.Active, firstPlayerId: idTelegram },
        { status: GameStatusesType.Active, secondPlayerId: idTelegram },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findFinishedByUserId(idTelegram: number, gameId: string): Promise<Game> {
    const game = await this.gameRepo.findOne({
      select: [],
      relations: {
        firstPlayerProgress: true,
        secondPlayerProgress: true,
        questions: true,
      },
      where: [
        { firstPlayerId: idTelegram, id: gameId },
        { secondPlayerId: idTelegram, id: gameId },
      ],
    });
    if (!game) return null;
    return game;
  }

  async findPlayer(idTelegram: number, gameId: string): Promise<Player> {
    const players = await this.playerRepo.find({
      select: [],
      relations: { answers: true },
      where: { userId: idTelegram, gameId: gameId, statusesPlayer: false },
    });
    if (players.length === 0) return null;
    return players[0];
  }

  async findPlayerForAlert(idTelegram: number, gameId: string): Promise<Player> {
    const players = await this.playerRepo.find({
      relations: { answers: true },
      where: { userId: idTelegram, gameId: gameId },
    });
    if (players.length === 0) return null;
    return players[0];
  }

  async findPlayerForAddPoint(idTelegram: number, gameId: string): Promise<Player> {
    return this.playerRepo
      .findOne({
        relations: { answers: true },
        where: { userId: idTelegram, gameId: gameId },
      })
      .catch(() => {
        return null;
      });
  }

  async countSuccessAnswers(idTelegram: number, gameId: string): Promise<number> {
    return this.answerRepo.count({
      where: {
        playerId: idTelegram,
        gameId: gameId,
        answerStatus: AnswerStatusesType.Correct,
      },
    });
  }

  async findAnswers(idTelegram: number, gameId: string): Promise<Answer[]> {
    return this.answerRepo.find({
      select: ['addedAt'],
      where: { playerId: idTelegram, gameId: gameId },
      order: { addedAt: 'ASC' },
    });
  }
}
