import { Injectable } from '@nestjs/common';
import { QueryParamsDto, SortDirection } from '../dto/query-params.dto';

@Injectable()
export class QueryParamsService {
  calculateSkip(params: QueryParamsDto): number {
    return (params.pageNumber - 1) * params.pageSize;
  }

  getSortOptions(params: QueryParamsDto): Record<string, 1 | -1> {
    return { [params.sortBy]: params.sortDirection === SortDirection.Asc ? 1 : -1 };
  }

  getSearchFilter(params: QueryParamsDto, searchFields: string[]): any {
    if (!params.searchTerm && !params.searchNameTerm) return {};

    const searchTerm = params.searchTerm || params.searchNameTerm;
    
    if (searchFields.length > 0 && searchTerm) {
      return {
        $or: searchFields.map(field => ({
          [field]: { $regex: searchTerm, $options: 'i' }
        }))
      };
    }

    return {};
  }
}