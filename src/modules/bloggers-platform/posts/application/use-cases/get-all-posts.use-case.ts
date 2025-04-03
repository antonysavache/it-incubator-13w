import { Injectable } from '@nestjs/common';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { PostView } from '../../domain/models/post-view.interface';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';

@Injectable()
export class GetAllPostsUseCase {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(params: BaseQueryParams): Promise<ToResult<PaginatedResult<PostView>>> {
    return await this.postsQueryRepository.findAll(params);
  }
}
