import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../../main/helpers/decorator-trim';
import { SortDirectionType } from '../../../../main/common/pagination-dto';

export class PaginationQuizDto {
  /**
   * pageSize is portions size that should be returned
   */
  @IsNumber()
  @IsOptional()
  pageSize: number = 10;
  /**
   *  pageNumber is number of portions that should be returned
   */
  @IsNumber()
  @IsOptional()
  pageNumber: number = 1;
  /**
   * Sort by parameters
   */
  @Trim()
  @IsString()
  @IsOptional()
  sortBy = 'pairCreatedDate';
  /**
   * Sort by desc or asc
   */
  @Trim()
  @IsEnum(SortDirectionType)
  @IsOptional()
  sortDirection: SortDirectionType = SortDirectionType.Desc;

  get skip(): number {
    return this.pageSize * (this.pageNumber - 1);
  }
}
