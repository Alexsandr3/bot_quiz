import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Trim } from '../helpers/decorator-trim';

export enum SortDirectionType {
  Asc = 'asc',
  Desc = 'desc',
}

export class PaginationDto {
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
  sortBy = 'createdAt';
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
