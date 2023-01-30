import { Markup } from 'telegraf';
export function buttonsMain() {
  return Markup.inlineKeyboard([Markup.button.callback('📜 Главное меню', 'main_menu')], {
    columns: 1,
  });
}

export function buttonsMenu() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('🧐 Game', 'game_menu'),
      Markup.button.callback('📝 Планировщик задач', 'todo_menu'),
      Markup.button.callback('🔙 Назад', 'back_main_menu'),
    ],
    {
      columns: 1,
    },
  );
}

export function buttonsGameMenu() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('🏁 Start', 'start_game'),
      Markup.button.callback('ℹ️ Info', 'info_game'),
      Markup.button.callback('🔙 Назад', 'back_game_menu'),
    ],
    {
      columns: 1,
    },
  );
}

export function buttonsToDo() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('📜 Список дел', 'tasks'),
      Markup.button.callback('📌 Добавить', 'add'),
      Markup.button.callback('🖊 Редактировать', 'edit'),
      Markup.button.callback('🤪 Выполнено', 'done'),
      Markup.button.callback('❌ Удаление', 'remove'),
      Markup.button.callback('🔙 Назад', 'back_menu'),
    ],
    {
      columns: 1,
    },
  );
}

export function buttonsToDo2() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('📌 Добавить', 'add'),
      Markup.button.callback('🖊 Редактировать', 'edit'),
      Markup.button.callback('🤪 Выполнено', 'done'),
      Markup.button.callback('❌ Удаление', 'remove'),
      Markup.button.callback('🔙 Назад', 'back_menu'),
    ],
    {
      columns: 2,
    },
  );
}

export function buttonsQuestions() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('следующий вопрос ⏩', 'question'),
      // Markup.button.callback('🔙 Сдаться 🏳️', 'back_game'),
    ],
    {
      columns: 1,
    },
  );
}

export function buttonsAnswers() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('жмякай чтобы ответить ⤵️', 'answers'),
      // Markup.button.callback('🔙 Сдаться 🏳️', 'back_game'),
    ],
    {
      columns: 1,
    },
  );
}
