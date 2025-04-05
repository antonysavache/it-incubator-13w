import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreatePostUseCase } from '../application/use-cases/create-post.use-case';
import { GetAllPostsUseCase } from '../application/use-cases/get-all-posts.use-case';
import { UpdatePostUseCase } from '../application/use-cases/update-post.use-case';
import { DeletePostUseCase } from '../application/use-cases/delete-post.use-case';
import { PostView } from '../domain/models/post-view.interface';
import { CreatePostDomainDto } from '../domain/dto/create-post.domain.dto';
import { GetPostByIdUseCase } from '../application/use-cases/get-post.use-case';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { QueryParamsDto } from '../../../../core/dto/query-params.dto';
import { PostDomain } from '../domain/post.domain';

@Controller('posts')
export class PostsController {
  constructor(
    private createPostUseCase: CreatePostUseCase,
    private getAllPostsUseCase: GetAllPostsUseCase,
    private getPostByIdUseCase: GetPostByIdUseCase,
    private updatePostUseCase: UpdatePostUseCase,
    private deletePostUseCase: DeletePostUseCase,
  ) {}

  @Get()
  async getAll(@Query() query: QueryParamsDto): Promise<PaginatedResult<PostView>> {
    const result = await this.getAllPostsUseCase.execute(query);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Post()
  async createPost(@Body() createPostDto: CreatePostDto & { blogId: string }): Promise<PostView> {
    const domainDto: CreatePostDomainDto = {
      title: createPostDto.title,
      shortDescription: createPostDto.shortDescription,
      content: createPostDto.content,
      blogId: createPostDto.blogId,
    };

    console.log(domainDto);

    const result = await this.createPostUseCase.execute(domainDto);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Get(':id')
  async getPostById(@Param('id') id: string): Promise<PostView> {
    const result = await this.getPostByIdUseCase.execute(id);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<void> {
    const domainDto: CreatePostDomainDto = {
      title: updatePostDto.title,
      shortDescription: updatePostDto.shortDescription,
      content: updatePostDto.content,
      blogId: updatePostDto.blogId,
    };

    const result = await this.updatePostUseCase.execute(id, domainDto);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') id: string): Promise<void> {
    const result = await this.deletePostUseCase.execute(id);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }
  }
}
