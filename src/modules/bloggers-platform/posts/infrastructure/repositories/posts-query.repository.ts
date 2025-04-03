import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseQueryRepository } from '../../../../../core/infrastructure/repositories/base-query.repository';
import { PostDocument } from '../schemas/post.schema';
import { PostView } from '../../domain/models/post-view.interface';
import { PostMapper } from '../mappers/post.mapper';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { PaginatedResult } from '../../../../../core/infrastructure/pagination';
import { ToResult } from '../../../../../core/infrastructure/result';

@Injectable()
export class PostsQueryRepository extends BaseQueryRepository<PostDocument, PostView> {
  constructor(
    @InjectModel('PostDocument') protected postModel: Model<PostDocument>,
    private postMapper: PostMapper
  ) {
    super(postModel);
  }

  mapToView(entity: PostDocument): PostView {
    return this.postMapper.documentToView(entity);
  }

  // Overload with a separate method name to avoid conflicts with BaseQueryRepository
  async getPostById(id: string): Promise<ToResult<PostView>> {
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

  async findAll(params: BaseQueryParams): Promise<ToResult<PaginatedResult<PostView>>> {
    try {
      const searchFields = ['title', 'shortDescription', 'content'];
      const result = await this.getAllWithPagination(params, searchFields);
      
      return ToResult.ok(result);
    } catch (error) {
      return ToResult.fail(error.message || 'Unknown error');
    }
  }

  async findAllByBlogId(blogId: string, params: BaseQueryParams): Promise<ToResult<PaginatedResult<PostView>>> {
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
