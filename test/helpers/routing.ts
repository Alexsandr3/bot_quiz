const globalPrefix = '';
const saController = `${globalPrefix}/sa`;
const quizController = `${globalPrefix}/pair-game-quiz/pairs`;
const testingController = `${globalPrefix}/testing`;

export const endpoints = {
  saController: {
    game: `${saController}/game`,
    quiz: `${saController}/quiz/questions`,
  },
  quizController: {
    id: `${quizController}`,
    connection: `${quizController}/connection`,
    answer: `${quizController}/my-current/answers`,
    my_current: `${quizController}/my-current`,
    my: `${quizController}/my`,
  },
  testingController: `${testingController}`,
  swaggerEndpoint: `/swagger`,
};

export const methods = {
  get: 'GET',
  post: 'POST',
  put: 'PUT',
  delete: 'DELETE',
};
