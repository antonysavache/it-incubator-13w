export class PaginatedResult<T> {
  items: T[];
  totalCount: number;
  pagesCount: number;
  page: number;
  pageSize: number;

  constructor(data: {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
  }) {
    this.items = data.items;
    this.totalCount = data.totalCount;
    this.pagesCount = Math.ceil(data.totalCount / data.pageSize);
    this.page = data.page;
    this.pageSize = data.pageSize;
  }
}