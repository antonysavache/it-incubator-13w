import { Model, Document } from 'mongoose';
import { QueryParamsDto } from '../../dto/query-params.dto';
import { PaginatedResult, PaginatedResultImpl } from '../pagination';
import { QueryParamsService } from '../../services/query-params.service';

export abstract class BaseQueryRepository<T extends Document, V> {
  constructor(
    protected model: Model<T>,
    protected queryParamsService: QueryParamsService
  ) {}

  abstract mapToView(entity: T): V;

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async getAll(searchFields: string[] = []): Promise<T[]> {
    return this.model.find({}).exec();
  }

  async getAllWithPagination(
    params: QueryParamsDto,
    searchFields: string[] = [],
    additionalFilter: any = {}
  ): Promise<PaginatedResult<V>> {
    const pageNumber = params.pageNumber || 1;
    const pageSize = params.pageSize || 10;
    const skip = this.queryParamsService.calculateSkip(params);
    const sortOptions = this.queryParamsService.getSortOptions(params);

    const searchFilter = this.queryParamsService.getSearchFilter(params, searchFields);
    const filter = { ...searchFilter, ...additionalFilter };

    const [items, totalCount] = await Promise.all([
      this.model
        .find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .exec(),
      this.model.countDocuments(filter),
    ]);

    const mappedItems = items.map(item => this.mapToView(item));

    return new PaginatedResultImpl({
      items: mappedItems,
      totalCount,
      pageNumber,
      pageSize,
    });
  }
}