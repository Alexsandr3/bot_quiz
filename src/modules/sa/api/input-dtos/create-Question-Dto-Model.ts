import { IsString, Length } from 'class-validator';
import { ArrayStrings } from '../../../../main/helpers/decorator-Array-strings';
import { Trim } from '../../../../main/helpers/decorator-trim';

export class CreateQuestionDto {
  /**
   * body: Text of question, for example: How many continents are there
   */
  @Trim()
  @Length(10, 500)
  @IsString()
  body: string;
  /**
   * correctAnswers: All variants of possible correct answers for current questions Examples: [6, 'six', 'шесть', 'дофига'] In Postgres save this data in JSON column
   */
  @ArrayStrings()
  correctAnswers: string[];
}
