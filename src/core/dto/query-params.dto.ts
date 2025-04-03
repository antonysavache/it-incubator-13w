import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export class QueryParamsDto {
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
  
  @IsOptional()
  @IsString()
  searchNameTerm?: string;
  
  @IsOptional()
  @IsString()
  searchLoginTerm?: string;
  
  @IsOptional()
  @IsString()
  searchEmailTerm?: string;
}