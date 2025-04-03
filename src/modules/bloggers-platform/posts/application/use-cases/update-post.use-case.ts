import { Injectable } from '@nestjs/common';
import { ToResult } from '../../../../../core/infrastructure/result';
import { CreatePostDomainDto } from '../../domain/dto/create-post.domain.dto';
import { Post } from '../../domain/post.domain';
import { PostsCommandRepository } from '../../infrastructure/repositories/posts-command.repository';
import { PostsQueryRepository } from '../../infrastructure/repositories/posts-query.repository';
import { PostMapper } from '../../infrastructure/mappers/post.mapper';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/repositories/blogs-query.repository';

@Injectable()
export class UpdatePostUseCase {
  constructor(
    private postsCommandRepository: PostsCommandRepository,
    private postsQueryRepository: PostsQueryRepository,
    private blogsQueryRepository: BlogsQueryRepository,
    private postMapper: PostMapper
  ) {}

  async execute(id: string, dto: CreatePostDomainDto): Promise<ToResult<void>> {
    try {
      // First, check if post exists
      const postResult = await this.postsQueryRepository.getPostById(id);
      
      if (postResult.isFailure()) {
        return ToResult.fail(postResult.error || `Post with id ${id} not found`);
      }
      
      // Check if blog exists
      const blogResult = await this.blogsQueryRepository.getBlogById(dto.blogId);
      
      if (blogResult.isFailure()) {
        return ToResult.fail(blogResult.error || `Blog with id ${dto.blogId} not found`);
      }
      
      const blog = blogResult.value!;
      const existingPost = postResult.value!;
      
      // Create updated domain entity with the same ID
      const updatedPost = Post.create({
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId,
        blogName: blog.name
      }, id);
      
      // Save to repository
      await this.postsCommandRepository.save(updatedPost);
      
      return ToResult.ok(undefined);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
