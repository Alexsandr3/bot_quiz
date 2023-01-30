import { Context } from '../types/context.interface';
import { Task } from '../../entities/task.entity';

export const showTasks = (ctx: Context, todos: Task[]) =>
  `<b>${ctx.from.first_name}</b> у тебя есть вот такое задание:` +
  '\n\n' +
  `${todos.map((t) => (t.isCompleted ? '✅' : '☞') + ' ' + `<b>${t.id} - ${t.title}</b>` + '\n\n').join('')}`;
