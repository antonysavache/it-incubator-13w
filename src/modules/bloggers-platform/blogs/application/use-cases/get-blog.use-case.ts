import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';

@Injectable()
export class GetBlogByIdUseCase {
  constructor(private blogsQueryRepository: BlogsQueryRepository) {}

  async execute(id: string): Promise<ToResult<BlogView>> {
    return await this.blogsQueryRepository.getBlogById(id);
  }
}
