import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { PostView } from '../../domain/models/post-view.interface';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';

@Injectable()
export class GetPostByIdUseCase {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(id: string): Promise<ToResult<PostView>> {
    return await this.postsQueryRepository.getPostById(id);
  }
}
