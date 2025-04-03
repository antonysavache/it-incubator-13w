import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { Blog } from '../../domain/blog.domain';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { BlogMapper } from '../../infrastructure/mappers/blog.mapper';
import { UpdateBlogModel } from '../../models/blog.models';

@Injectable()
export class UpdateBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private blogMapper: BlogMapper
  ) {}

  async execute(id: string, model: UpdateBlogModel): Promise<ToResult<void>> {
    try {
      const blogResult = await this.blogsQueryRepository.getBlogById(id);
      
      if (blogResult.isFailure()) {
        return ToResult.fail(blogResult.error || `Blog with id ${id} not found`);
      }
      
      const existingBlog = blogResult.value!;
      
      const updatedBlog = Blog.create({
        name: model.name,
        description: model.description,
        websiteUrl: model.websiteUrl,
        createdAt: new Date(existingBlog.createdAt),
        isMembership: existingBlog.isMembership
      }, id);
      
      await this.blogsCommandRepository.save(updatedBlog);
      
      return ToResult.ok(undefined);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}