import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../../entities/user.entity';
import { Task } from '../../../entities/task.entity';

@Injectable()
export class UsersRepositories {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(Task)
    private readonly taskRepo: Repository<Task>,
  ) {}

  async saveUser(createdUser: User): Promise<number> {
    const user = await this.userRepo.save(createdUser);
    return user.id;
  }

  async deleteUser(id: string): Promise<boolean> {
    await this.userRepo.manager.connection
      .transaction(async (manager) => {
        await manager.createQueryBuilder().delete().from('user').where('id = :id', { id }).execute();
        // await manager.createQueryBuilder()
        //   .delete()
        //   .from("email_confirmation")
        //   .where("userId = :id", { id })
        //   .execute();
        // await manager.createQueryBuilder()
        //   .delete()
        //   .from("email_recovery")
        //   .where("userId = :id", { id })
        //   .execute();
      })
      .catch((e) => {
        return console.log(e);
      });
    return true;
  }

  async getAll(): Promise<User[]> {
    return await this.userRepo.find();
  }

  async findUserById(idTelegram: number) {
    const user = await this.userRepo.findOneBy({ idTelegram: idTelegram });
    console.log('user', user);
    if (!user) return null;
    return user;
  }

  async findTask(idTelegram: number): Promise<Task[]> {
    const tasks = await this.taskRepo.find({
      select: ['id', 'title', 'isCompleted'],
      where: { idTelegram: idTelegram },
    });
    if (tasks.length == 0) return null;
    return tasks;
  }

  async saveTask(newTask: Task): Promise<number> {
    const task = await this.taskRepo.save(newTask);
    return task.id;
  }

  async findTaskByIdTask(taskId: number): Promise<Task> {
    const tasks = await this.taskRepo.findOne({
      select: ['id', 'title', 'isCompleted'],
      where: { id: taskId },
    });
    if (!tasks) return null;
    return tasks;
  }

  async deleteTask(taskId: number) {
    await this.taskRepo.manager.connection
      .transaction(async (manager) => {
        await manager.delete(Task, { id: taskId });
      })
      .catch((e) => {
        console.log(e);
        return false;
      });
    return true;
  }

  async getTodo(): Promise<User[]> {
    const tasks = await this.userRepo.find({
      relations: { tasks: true },
    });
    if (tasks.length == 0) return null;
    return tasks;
  }
}
