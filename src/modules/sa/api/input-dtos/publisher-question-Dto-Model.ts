import { IsBoolean, IsOptional } from 'class-validator';

export class PublisherQuestionDto {
  /**
   * published: True if question is completed and can be used in the Quiz game
   */
  @IsBoolean()
  @IsOptional()
  published = true;
  // published: boolean;
}
