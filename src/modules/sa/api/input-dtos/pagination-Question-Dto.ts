import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../../../main/common/pagination-dto';

export enum PublishedStatusType {
  all = 'all',
  published = 'published',
  notPublished = 'notPublished',
}

export class PaginationQuestionDto extends PaginationDto {
  /**
   * banStatus by parameters
   */
  @IsString()
  @IsEnum(PublishedStatusType)
  @IsOptional()
  publishedStatus: PublishedStatusType = PublishedStatusType.all;
  /**
   * Search term for body
   */
  @IsString()
  @IsOptional()
  bodySearchTerm: string = '';
}
