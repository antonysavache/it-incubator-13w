// Common pagination result format for the application
export class PaginatedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  pagesCount: number;

  // For testing purposes, we can hide the pagesCount field when serializing to JSON
  toJSON() {
    return {
      items: this.items,
      totalCount: this.totalCount,
      page: this.page,
      pageSize: this.pageSize
    };
  }

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