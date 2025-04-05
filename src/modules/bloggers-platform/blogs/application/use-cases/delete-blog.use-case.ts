import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { BlogsCommandRepository } from '../../infrastructure/repositories/blogs-command.repository';
import { BlogsQueryRepository } from '../../infrastructure/repositories/blogs-query.repository';

@Injectable()
export class DeleteBlogUseCase {
  constructor(
    private blogsCommandRepository: BlogsCommandRepository,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute(id: string): Promise<ToResult<void>> {
    try {
      const blogResult = await this.blogsQueryRepository.getBlogById(id);
      
      if (blogResult.isFailure()) {
        return ToResult.fail(blogResult.error || `Blog with id ${id} not found`);
      }
      
      const isDeleted = await this.blogsCommandRepository.delete(id);
      
      if (!isDeleted) {
        return ToResult.fail(`Failed to delete blog with id ${id}`);
      }
      
      return ToResult.ok(undefined);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
