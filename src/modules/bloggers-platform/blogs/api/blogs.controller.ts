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
import { BlogView } from '../domain/models/blog-view.interface';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';
import { GetBlogByIdUseCase } from '../application/use-cases/get-blog.use-case';
import { BaseQueryParams } from '../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../core/infrastructure/pagination';
import { BlogEntity } from '../domain/blog.entity';
import { UpdateBlogDto } from '../domain/dto/update-blog.dto';

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
  async getAll(@Query() query: BaseQueryParams): Promise<PaginatedResult<BlogView>> {
    const result = await this.getAllBlogsUseCase.execute(query);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    // Гарантируем, что value не undefined - если result.isFailure() == false,
    // то value должно быть определено
    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Post()
  async createBlog(@Body() createBlogDto: BlogEntity): Promise<BlogView> {
    // Преобразуем DTO запроса в доменный DTO
    const domainDto: CreateBlogDomainDto = {
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    };

    const result = await this.createBlogUseCase.execute(domainDto);

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    if (!result.value) {
      throw new BadRequestException('Unexpected error: result value is undefined');
    }

    return result.value;
  }

  @Get(':id')
  async getBlogById(@Param('id') id: string): Promise<BlogView> {
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
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<void> {
    const domainDto: CreateBlogDomainDto = {
      name: updateBlogDto.name,
      description: updateBlogDto.description,
      websiteUrl: updateBlogDto.websiteUrl,
    };

    const result = await this.updateBlogUseCase.execute(id, domainDto);

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