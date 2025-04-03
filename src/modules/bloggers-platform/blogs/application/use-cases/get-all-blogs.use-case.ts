import { Injectable } from '@nestjs/common';
import { QueryParamsDto } from '../../../../../core/dto/query-params.dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { ViewBlogModel } from '../../models/blog.models';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';

@Injectable()
export class GetAllBlogUseCase {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(params: QueryParamsDto): Promise<ToResult<PaginatedResult<ViewBlogModel>>> {
    return await this.blogsQueryRepository.findAll(params);
  }
}
