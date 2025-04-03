import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryRepository } from '../../../../../core/infrastructure/repositories/base-query.repository';
import { BlogDocument } from '../schemas/blog.schema';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BlogMapper } from '../mappers/blog.mapper';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';

@Injectable()
export class BlogsQueryRepository extends BaseQueryRepository<BlogDocument, BlogView> {
  constructor(
    @InjectModel('BlogDocument') protected blogModel: Model<BlogDocument>,
    private blogMapper: BlogMapper
  ) {
    super(blogModel);
  }

  mapToView(entity: BlogDocument): BlogView {
    return this.blogMapper.documentToView(entity);
  }

  // Overload with a separate method name to avoid conflicts with BaseQueryRepository
  async getBlogById(id: string): Promise<ToResult<BlogView>> {
    try {
      const blog = await this.findById(id);
      
      if (!blog) {
        return ToResult.fail(`Blog with id ${id} not found`);
      }
      
      return ToResult.ok(this.mapToView(blog));
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }

  async findAll(params: BaseQueryParams): Promise<ToResult<PaginatedResult<BlogView>>> {
    try {
      const searchFields = ['name', 'description', 'websiteUrl'];
      const result = await this.getAllWithPagination(params, searchFields);
      
      return ToResult.ok(result);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}