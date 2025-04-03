import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { PostsCommandRepository } from '../../infrastructure/repositories/posts-command.repository';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';

@Injectable()
export class DeletePostUseCase {
  constructor(
    private postsCommandRepository: PostsCommandRepository,
    private postsQueryRepository: PostsQueryRepository
  ) {}

  async execute(id: string): Promise<ToResult<void>> {
    try {
      // First, check if post exists
      const postResult = await this.postsQueryRepository.getPostById(id);
      
      if (postResult.isFailure()) {
        return ToResult.fail(postResult.error || `Post with id ${id} not found`);
      }
      
      // Delete from repository
      const isDeleted = await this.postsCommandRepository.delete(id);
      
      if (!isDeleted) {
        return ToResult.fail(`Failed to delete post with id ${id}`);
      }
      
      return ToResult.ok(undefined);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
