import { Injectable } from '@nestjs/common';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { PostView } from '../../domain/models/post-view.interface';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/repositories/blogs-query.repository';

@Injectable()
export class GetBlogPostsUseCase {
  constructor(
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute(blogId: string, params: BaseQueryParams): Promise<ToResult<PaginatedResult<PostView>>> {
    // First check if blog exists
    const blogResult = await this.blogsQueryRepository.getBlogById(blogId);
    
    if (blogResult.isFailure()) {
      return ToResult.fail(`Blog with id ${blogId} not found`);
    }
    
    return await this.postsQueryRepository.findAllByBlogId(blogId, params);
  }
}
