import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { CreateBlogDomainDto } from '../../domain/dto/create-blog.domain.dto';
import { Blog } from '../../domain/blog.domain';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';
import { BlogMapper } from '../../infrastructure/mappers/blog.mapper';

@Injectable()
export class UpdateBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private blogMapper: BlogMapper
  ) {}

  async execute(id: string, dto: CreateBlogDomainDto): Promise<ToResult<void>> {
    try {
      // First, check if blog exists
      const blogResult = await this.blogsQueryRepository.getBlogById(id);
      
      if (blogResult.isFailure()) {
        return ToResult.fail(blogResult.error || `Blog with id ${id} not found`);
      }
      
      const existingBlog = blogResult.value!;
      
      // Create updated domain entity with the same ID and createdAt
      const updatedBlog = Blog.create({
        name: dto.name,
        description: dto.description,
        websiteUrl: dto.websiteUrl,
        createdAt: new Date(existingBlog.createdAt),
        isMembership: existingBlog.isMembership
      }, id);
      
      // Save to repository
      await this.blogsCommandRepository.save(updatedBlog);
      
      return ToResult.ok(undefined);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
