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
import { CreateBlogUseCase } from '../application/use-cases/create-blog.use-case';
import { GetAllBlogUseCase } from '../application/use-cases/get-all-blogs.use-case';
import { UpdateBlogUseCase } from '../application/use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from '../application/use-cases/delete-blog.use-case';
import { GetBlogByIdUseCase } from '../application/use-cases/get-blog.use-case';
import { QueryParamsDto } from '../../../../core/dto/query-params.dto';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { CreateBlogModel, UpdateBlogModel, ViewBlogModel } from '../models/blog.models';

@Controller('blogs')
export class BlogsController {
  constructor(
    private createBlogUseCase: CreateBlogUseCase,
    private getAllBlogsUseCase: GetAllBlogUseCase,
    private getBlogByIdUseCase: GetBlogByIdUseCase,
    private updateBlogUseCase: UpdateBlogUseCase,
    private deleteBlogUseCase: DeleteBlogUseCase,
  ) {}

  @Get()
  async getAll(@Query() query: QueryParamsDto): Promise<PaginatedResult<ViewBlogModel>> {
    const result = await this.getAllBlogsUseCase.execute(query);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Post()
  async createBlog(@Body() createBlogModel: CreateBlogModel): Promise<ViewBlogModel> {
    const result = await this.createBlogUseCase.execute(createBlogModel);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<ViewBlogModel> {
    const result = await this.getBlogByIdUseCase.execute(id);

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
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogModel: UpdateBlogModel,
  ): Promise<void> {
    const result = await this.updateBlogUseCase.execute(id, updateBlogModel);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    const result = await this.deleteBlogUseCase.execute(id);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }
  }
}