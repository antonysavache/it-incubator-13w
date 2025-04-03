import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { ViewBlogModel } from '../../models/blog.models';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';

@Injectable()
export class GetBlogByIdUseCase {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(id: string): Promise<ToResult<ViewBlogModel>> {
    return await this.blogsQueryRepository.getBlogById(id);
  }
}
