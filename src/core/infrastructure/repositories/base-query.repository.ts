import { Model, Document } from 'mongoose';
import { QueryParamsDto } from '../../dto/query-params.dto';
import { PaginatedResult } from '../pagination';
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
    const { pageNumber, pageSize } = params;
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

    return new PaginatedResult({
      items: mappedItems,
      totalCount,
      page: pageNumber,
      pageSize,
    });
  }
}