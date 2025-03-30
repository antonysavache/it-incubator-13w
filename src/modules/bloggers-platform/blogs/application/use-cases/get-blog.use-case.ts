import { Injectable } from '@nestjs/common';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { ToResult } from '../../../../../core/infrastructure/result';

@Injectable()
export class GetBlogByIdUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(id: string): Promise<ToResult<BlogView>> {
    try {
      const blog = await this.blogsQueryRepository.findById(id);

      if (!blog) {
        return ToResult.fail(`Блог с ID ${id} не найден`);
      }

      const blogView: BlogView = {
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: new Date(blog.createdAt),
        isMembership: blog.isMembership
      };

      return ToResult.ok(blogView);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}