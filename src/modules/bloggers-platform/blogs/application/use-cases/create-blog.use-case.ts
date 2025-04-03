import { Injectable } from '@nestjs/common';
import { CreateBlogDomainDto } from '../../domain/dto/create-blog.domain.dto';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { ToResult } from '../../../../../core/infrastructure/result';
import { Blog } from '../../domain/blog.domain';
import { BlogMapper } from '../../infrastructure/mappers/blog.mapper';

@Injectable()
export class CreateBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogMapper: BlogMapper
  ) {}

  async execute(dto: CreateBlogDomainDto): Promise<ToResult<BlogView>> {
    try {
      // Create a domain entity
      const blog = Blog.create({
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl
      });
      
      // Save to repository
      const savedBlogDocument = await this.blogsCommandRepository.save(blog);
      
      // Map to domain then to view
      const savedBlog = this.blogMapper.toDomain(savedBlogDocument);
      const blogView = this.blogMapper.toView(savedBlog);

      return ToResult.ok(blogView);
    } catch (error) {
      return ToResult.fail(error.message);
    }
  }
}