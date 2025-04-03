import { Injectable } from '@nestjs/common';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { PostView } from '../../domain/models/post-view.interface';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/repositories/blogs-query.repository';
import { QueryParamsDto } from '../../../../../core/dto/query-params.dto';

@Injectable()
export class GetBlogPostsUseCase {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute(blogId: string, params: QueryParamsDto): Promise<ToResult<PaginatedResult<PostView>>> {
    const blogResult = await this.blogsQueryRepository.getBlogById(blogId);
    
    if (blogResult.isFailure()) {
      return ToResult.fail(`Blog with id ${blogId} not found`);
    }
    
    return await this.postsQueryRepository.findAllByBlogId(blogId, params);
  }
}
