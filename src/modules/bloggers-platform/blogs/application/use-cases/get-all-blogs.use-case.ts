import { Injectable } from '@nestjs/common';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';

@Injectable()
export class GetAllBlogUseCase {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(params: BaseQueryParams): Promise<ToResult<PaginatedResult<BlogView>>> {
    return await this.blogsQueryRepository.findAll(params);
  }
}
