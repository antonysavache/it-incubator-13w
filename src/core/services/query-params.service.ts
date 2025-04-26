import { Injectable } from '@nestjs/common';
import { QueryParamsDto, SortDirection } from '../dto/query-params.dto';

@Injectable()
export class QueryParamsService {
  calculateSkip(params: QueryParamsDto): number {
    return ((params.pageNumber || 1) - 1) * (params.pageSize || 10);
  }

  getSortOptions(params: QueryParamsDto): Record<string, 1 | -1> {
    const sortBy = params.sortBy || 'createdAt';
    return { [sortBy]: params.sortDirection === SortDirection.Asc ? 1 : -1 };
  }

  getSearchFilter(params: QueryParamsDto, searchFields: string[]): any {
    const searchNameTerm = params.searchNameTerm;
    
    if (searchFields.length > 0 && searchNameTerm) {
      return {
        $or: searchFields.map(field => ({
          [field]: { $regex: searchNameTerm, $options: 'i' }
        }))
      };
    }

    return {};
  }
}