import { Injectable } from '@nestjs/common';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { ToResult } from '../../../../../core/infrastructure/result';
import { Blog } from '../../domain/blog.domain';
import { BlogMapper } from '../../infrastructure/mappers/blog.mapper';
import { CreateBlogModel, ViewBlogModel } from '../../models/blog.models';

@Injectable()
export class CreateBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogMapper: BlogMapper
  ) {}

  async execute(model: CreateBlogModel): Promise<ToResult<ViewBlogModel>> {
    try {
      const blog = Blog.create({
        name: model.name,
        description: model.description,
        websiteUrl: model.websiteUrl
      });
      
      const savedBlogDocument = await this.blogsCommandRepository.save(blog);
      
      const savedBlog = this.blogMapper.toDomain(savedBlogDocument);
      const blogView = this.blogMapper.toView(savedBlog);

      return ToResult.ok(blogView);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}