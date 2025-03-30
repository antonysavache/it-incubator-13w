import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class BaseQueryParams {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  sortBy: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortDirection: SortDirection = SortDirection.Desc;

  @IsOptional()
  @IsString()
  searchTerm?: string;

  calculateSkip(): number {
    return (this.pageNumber - 1) * this.pageSize;
  }

  getSortOptions(): Record<string, 1 | -1> {
    return { [this.sortBy]: this.sortDirection === SortDirection.Asc ? 1 : -1 };
  }

  getSearchFilter(searchFields: string[]): any {
    if (!this.searchTerm) return {};

    if (searchFields.length > 0) {
      return {
        $or: searchFields.map(field => ({
          [field]: { $regex: this.searchTerm, $options: 'i' }
        }))
      };
    }

    return {};
  }
}