import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';

@Injectable()
export class GetAllBlogUseCase {
  constructor(
    private blogsQueryRepository: BlogsQueryRepository,
  ) {}

  async execute(): Promise<ToResult<BlogView[]>> {
    try {
      const blogs = await this.blogsQueryRepository.getAll();

      const blogViews: BlogView[] = blogs.map(blog => ({
        id: blog._id.toString(),
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: new Date(blog.createdAt),
        isMembership: blog.isMembership
      }));

      return ToResult.ok(blogViews);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}