import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { PostView } from '../../domain/models/post-view.interface';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';
import { QueryParamsDto } from '../../../../../core/dto/query-params.dto';

@Injectable()
export class GetAllPostsUseCase {
  constructor(private postsQueryRepository: PostsQueryRepository) {}

  async execute(params: QueryParamsDto): Promise<ToResult<PaginatedResult<PostView>>> {
    return await this.postsQueryRepository.findAll(params);
  }
}
