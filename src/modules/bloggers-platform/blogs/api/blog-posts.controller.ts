import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PostView } from '../../posts/domain/models/post-view.interface';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { CreatePostDto } from '../../posts/api/dto/create-post.dto';
import { CreatePostUseCase } from '../../posts/application/use-cases/create-post.use-case';
import { GetBlogPostsUseCase } from '../../posts/application/use-cases/get-blog-posts.use-case';
import { CreatePostDomainDto } from '../../posts/domain/dto/create-post.domain.dto';
import { QueryParamsDto } from '../../../../core/dto/query-params.dto';

@Controller('blogs')
export class BlogPostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getBlogPostsUseCase: GetBlogPostsUseCase,
  ) {}

  @Get(':blogId/posts')
  async getBlogPosts(
    @Param('blogId') blogId: string,
    @Query() query: QueryParamsDto
  ): Promise<PaginatedResult<PostView>> {
    const result = await this.getBlogPostsUseCase.execute(blogId, query);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Post(':blogId/posts')
  async createBlogPost(
    @Param('blogId') blogId: string,
    @Body() createPostDto: CreatePostDto
  ): Promise<PostView> {
    const domainDto: CreatePostDomainDto = {
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: blogId,
    };

    const result = await this.createPostUseCase.execute(domainDto);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }
}
