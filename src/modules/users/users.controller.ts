import { Controller, Get } from '@nestjs/common';
import { UsersRepositories } from './repositories/users-repositories';
import { User } from '../../entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersRepositories: UsersRepositories) {}

  @Get()
  async findAll(): Promise<User[]> {
    return await this.usersRepositories.getAll();
  }

  @Get(`todo`)
  async findTodo(): Promise<User[]> {
    return await this.usersRepositories.getTodo();
  }
}
