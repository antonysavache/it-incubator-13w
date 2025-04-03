import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryRepository } from '../../../../../core/infrastructure/repositories/base-query.repository';
import { PostDocument } from '../schemas/post.schema';
import { PostMapper } from '../mappers/post.mapper';
import { QueryParamsDto } from '../../../../../core/dto/query-params.dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';
import { ViewPostModel } from '../../models/post.models';
import { QueryParamsService } from '../../../../../core/services/query-params.service';

@Injectable()
export class PostsQueryRepository extends BaseQueryRepository<PostDocument, ViewPostModel> {
  constructor(
    @InjectModel('PostDocument') protected postModel: Model<PostDocument>,
    private postMapper: PostMapper,
    protected queryParamsService: QueryParamsService
  ) {
    super(postModel, queryParamsService);
  }

  mapToView(entity: PostDocument): ViewPostModel {
    return this.postMapper.documentToView(entity);
  }

  async getPostById(id: string): Promise<ToResult<ViewPostModel>> {
    try {
      const post = await this.findById(id);
      
      if (!post) {
        return ToResult.fail(`Post with id ${id} not found`);
      }
      
      return ToResult.ok(this.mapToView(post));
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }

  async findAll(params: QueryParamsDto): Promise<ToResult<PaginatedResult<ViewPostModel>>> {
    try {
      const searchFields = ['title', 'shortDescription', 'content'];
      const result = await this.getAllWithPagination(params, searchFields);
      
      return ToResult.ok(result);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }

  async findAllByBlogId(blogId: string, params: QueryParamsDto): Promise<ToResult<PaginatedResult<ViewPostModel>>> {
    try {
      const searchFields = ['title', 'shortDescription', 'content'];
      const additionalFilter = { blogId };
      const result = await this.getAllWithPagination(params, searchFields, additionalFilter);
      
      return ToResult.ok(result);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }
}