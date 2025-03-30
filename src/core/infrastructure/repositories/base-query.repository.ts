import { Model, Document } from 'mongoose';
import { BaseQueryParams } from '../../dto/base.query-params.input-dto';
import { PaginatedResult } from '../pagination';

export abstract class BaseQueryRepository<T extends Document, V> {
  constructor(protected model: Model<T>) {}

  abstract mapToView(entity: T): V;

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async getAll(searchFields: string[] = []): Promise<T[]> {
    return this.model.find({}).exec();
  }

  async getAllWithPagination(
    params: BaseQueryParams,
    searchFields: string[] = [],
    additionalFilter: any = {}
  ): Promise<PaginatedResult<V>> {
    const { pageNumber, pageSize } = params;
    const skip = params.calculateSkip();
    const sortOptions = params.getSortOptions();

    const searchFilter = params.getSearchFilter(searchFields);
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