import { QuizRepositories } from '../../../infrastructure/quiz-repositories';
import { Player } from '../../../../../entities/player.entity';
import { Game } from '../../../../../entities/game.entity';
import { GameViewModel } from '../../../infrastructure/query-repository/game-View-Model';
import { QuizQueryRepositories } from '../../../infrastructure/query-repository/quiz-query-repositories';
import { UsersRepositories } from '../../../../users/repositories/users-repositories';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ConnectionQuizUseCase {
  constructor(
    private readonly quizRepo: QuizRepositories,
    private readonly usersRepo: UsersRepositories,
    private readonly quizQueryRepo: QuizQueryRepositories,
  ) {}

  async execute(idTelegram: number, firstName: string): Promise<GameViewModel> {
    //find a waiting game
    const pendingGame = await this.quizRepo.findPendingGame();
    if (pendingGame) {
      const gameId = await this.connectionSecondPlayer(idTelegram, firstName, pendingGame);
      //the game for viewing
      return this.quizQueryRepo.mappedSecondPlayerForView(gameId);
    }
    const gameId = await this.connectionFirstPlayer(idTelegram, firstName);
    //the game for viewing
    return this.quizQueryRepo.mappedFirstPlayerForView(gameId);
  }
  private async connectionFirstPlayer(idTelegram: number, firstName: string): Promise<string> {
    //search for questions
    const questions = await this.quizRepo.findQuestions();
    console.log('questions', questions);
    //creating instance game
    const game = Game.createGame(questions, idTelegram); //questions
    const savedGame = await this.quizRepo.saveGame(game);
    //creating instance player
    const player = Player.createPlayer(idTelegram, savedGame.id, firstName);
    const savedPlayer = await this.quizRepo.savePlayer(player);
    //adding the first player to the game
    savedGame.addFirstPlayer(savedPlayer);
    const result = await this.quizRepo.saveGame(savedGame);
    return result.id;
  }

  private async connectionSecondPlayer(
    idTelegram: number,
    firstName: string,
    pendingGame: Game,
  ): Promise<string> {
    //creating instance player
    const player = Player.createPlayer(idTelegram, pendingGame.id, firstName);
    const savedPlayer = await this.quizRepo.savePlayer(player);
    //adding a second player to the game
    pendingGame.addSecondPlayer(savedPlayer, idTelegram);
    const result = await this.quizRepo.saveGame(pendingGame);
    return result.id;
  }
}
