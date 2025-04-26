import { IsOptional, IsNumber, Min, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export enum SortDirection {
  Asc = 'asc',
  Desc = 'desc'
}

export class QueryParamsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pageNumber?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Min(1)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsString()
  sortDirection?: SortDirection = SortDirection.Desc;

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