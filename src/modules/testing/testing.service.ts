import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { Answer } from '../../entities/answer.entity';
import { Player } from '../../entities/player.entity';
import { Game } from '../../entities/game.entity';
import { Question } from '../../entities/question.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async deleteAll() {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Answer, {});
        // await manager.delete(Question, {});
        await manager.delete(Player, {});
        await manager.delete(Game, {});
        await manager.delete(User, {});
      })
      .catch((e) => {
        return console.log(e);
      });
    return;
  }
}
