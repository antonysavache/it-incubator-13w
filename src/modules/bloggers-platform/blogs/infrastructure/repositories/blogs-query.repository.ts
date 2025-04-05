import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryRepository } from '../../../../../core/infrastructure/repositories/base-query.repository';
import { BlogDocument } from '../schemas/blog.schema';
import { BlogMapper } from '../mappers/blog.mapper';
import { QueryParamsDto } from '../../../../../core/dto/query-params.dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { ViewBlogModel } from '../../models/blog.models';
import { QueryParamsService } from '../../../../../core/services/query-params.service';

@Injectable()
export class BlogsQueryRepository extends BaseQueryRepository<BlogDocument, ViewBlogModel> {
  constructor(
    @InjectModel('BlogDocument') protected blogModel: Model<BlogDocument>,
    private blogMapper: BlogMapper,
    protected queryParamsService: QueryParamsService
  ) {
    super(blogModel, queryParamsService);
  }

  mapToView(entity: BlogDocument): ViewBlogModel {
    return this.blogMapper.documentToView(entity);
  }

  async getBlogById(id: string): Promise<ToResult<ViewBlogModel>> {
    try {
      console.log(id);
      const blog = await this.findById(id);
      console.log(blog);
      
      if (!blog) {
        return ToResult.fail(`Blog with id ${id} not found`);
      }
      
      return ToResult.ok(this.mapToView(blog));
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }

  async findAll(params: QueryParamsDto): Promise<ToResult<PaginatedResult<ViewBlogModel>>> {
    try {
      const searchFields = ['name', 'description', 'websiteUrl'];
      const result = await this.getAllWithPagination(params, searchFields);
      
      return ToResult.ok(result);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}