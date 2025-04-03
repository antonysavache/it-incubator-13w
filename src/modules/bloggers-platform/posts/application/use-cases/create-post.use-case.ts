import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePostDomainDto } from '../../domain/dto/create-post.domain.dto';
import { PostView } from '../../domain/models/post-view.interface';
import { PostsCommandRepository } from '../../infrastructure/repositories/posts-command.repository';
import { ToResult } from '../../../../../core/infrastructure/result';
import { Post } from '../../domain/post.domain';
import { PostMapper } from '../../infrastructure/mappers/post.mapper';
import { BlogsQueryRepository } from '../../../blogs/infrastructure/repositories/blogs-query.repository';

@Injectable()
export class CreatePostUseCase {
  constructor(
    private postsCommandRepository: PostsCommandRepository,
    private postMapper: PostMapper,
    private blogsQueryRepository: BlogsQueryRepository
  ) {}

  async execute(dto: CreatePostDomainDto): Promise<ToResult<PostView>> {
    try {
      // Get the blog to ensure it exists and to get the blog name
      const blogResult = await this.blogsQueryRepository.getBlogById(dto.blogId);
      
      if (blogResult.isFailure()) {
        return ToResult.fail(`Blog with id ${dto.blogId} not found`);
      }
      
      const blog = blogResult.value!;
      
      // Create a domain entity
      const post = Post.create({
        title: dto.title,
        shortDescription: dto.shortDescription,
        content: dto.content,
        blogId: dto.blogId,
        blogName: blog.name
      });
      
      // Save to repository
      const savedPostDocument = await this.postsCommandRepository.save(post);
      
      // Map to domain then to view
      const savedPost = this.postMapper.toDomain(savedPostDocument);
      const postView = this.postMapper.toView(savedPost);

      return ToResult.ok(postView);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}
