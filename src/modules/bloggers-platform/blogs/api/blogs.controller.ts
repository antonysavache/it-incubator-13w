import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateBlogUseCase } from '../application/use-cases/create-blog.use-case';
import { GetAllBlogUseCase } from '../application/use-cases/get-all-blogs.use-case';
import { GetBlogByIdUseCase } from '../application/use-cases/get-blog-by-id.use-case';
import { UpdateBlogUseCase } from '../application/use-cases/update-blog.use-case';
import { DeleteBlogUseCase } from '../application/use-cases/delete-blog.use-case';
import { CreateBlogDto } from './dto/create-blog.dto';
import { UpdateBlogDto } from './dto/update-blog.dto';
import { BlogView } from '../domain/models/blog-view.interface';
import { CreateBlogDomainDto } from '../domain/dto/create-blog.domain.dto';
import { UpdateBlogDomainDto } from '../domain/dto/update-blog.domain.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlogQueryParams } from '../domain/dto/blog-query-params.dto';

@ApiTags('Blogs')
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
  @ApiOperation({ summary: 'Returns blogs with paging' })
  @ApiResponse({ status: 200, description: 'Success', type: [BlogView] })
  async getAll(@Query() query: BlogQueryParams): Promise<BlogView[] | undefined> {
    const result = await this.getAllBlogsUseCase.execute();

    if (result.isFailure()) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  @Post()
  @ApiOperation({ summary: 'Create new blog' })
  @ApiResponse({ status: 201, description: 'The blog has been successfully created', type: BlogView })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async createBlog(@Body() createBlogDto: CreateBlogDto): Promise<BlogView> {
    // Преобразуем DTO запроса в доменный DTO
    const domainDto: CreateBlogDomainDto = {
      name: createBlogDto.name,
      description: createBlogDto.description,
      websiteUrl: createBlogDto.websiteUrl,
    };

    const result = await this.createBlogUseCase.execute(domainDto);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns blog by id' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiResponse({ status: 200, description: 'Success', type: BlogView })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  async getBlogById(@Param('id') id: string): Promise<BlogView> {
    const result = await this.getBlogByIdUseCase.execute(id);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }

    return result.value;
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing Blog by id with InputModel' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateBlog(
    @Param('id') id: string,
    @Body() updateBlogDto: UpdateBlogDto,
  ): Promise<void> {
    // Преобразуем DTO запроса в доменный DTO
    const domainDto: UpdateBlogDomainDto = {
      name: updateBlogDto.name,
      description: updateBlogDto.description,
      websiteUrl: updateBlogDto.websiteUrl,
    };

    const result = await this.updateBlogUseCase.execute(id, domainDto);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete blog specified by id' })
  @ApiParam({ name: 'id', description: 'Blog ID' })
  @ApiResponse({ status: 204, description: 'No Content' })
  @ApiResponse({ status: 404, description: 'Blog not found' })
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteBlog(@Param('id') id: string): Promise<void> {
    const result = await this.deleteBlogUseCase.execute(id);

    if (result.isFailure) {
      throw new NotFoundException(result.error);
    }
  }
}