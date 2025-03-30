import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';

@Injectable()
export class GetAllBlogUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(params: BaseQueryParams): Promise<ToResult<PaginatedResult<BlogView>>> {
    try {
      const paginatedResult = await this.blogsQueryRepository.getAllWithPagination(params);
      return ToResult.ok(paginatedResult);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}