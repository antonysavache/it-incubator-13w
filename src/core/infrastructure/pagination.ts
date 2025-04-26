export interface PaginatedResult<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}

export class PaginatedResultImpl<T> implements PaginatedResult<T> {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];

  constructor(data: {
    items: T[];
    totalCount: number;
    pageSize: number;
    pageNumber: number;
  }) {
    this.items = data.items;
    this.totalCount = data.totalCount;
    this.pageSize = data.pageSize;
    this.page = data.pageNumber;
    this.pagesCount = Math.ceil(data.totalCount / data.pageSize);
  }
}