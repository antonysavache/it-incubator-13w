import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  BLogDocument,
  BlogEntity,
  BlogModelType,
} from '../../domain/blog.entity';
import { BaseQueryRepository } from '../../../../../core/infrastructure/repositories/base-query.repository';
import { BlogView } from '../../domain/models/blog-view.interface';
import { BaseQueryParams } from '../../../../../core/dto/base.query-params.input-dto';
import { blogSearchFieldsModel } from '../../domain/models/blog-search-fields.model';

@Injectable()
export class BlogsQueryRepository extends BaseQueryRepository<BLogDocument, BlogView> {
  constructor(@InjectModel(BlogEntity.name) private blogModel: BlogModelType) {
    super(blogModel);
  }

  mapToView(blog: BLogDocument): BlogView {
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: new Date(blog.createdAt),
      isMembership: blog.isMembership
    };
  }

  protected getBlogSearchFields(): string[] {
    return blogSearchFieldsModel;
  }

  async getAllWithPagination(params: BaseQueryParams) {
    return super.getAllWithPagination(params, this.getBlogSearchFields());
  }
}