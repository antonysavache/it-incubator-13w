import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../schemas/blog.schema';
import { BlogMapper } from '../mappers/blog.mapper';
import { Blog } from '../../domain/blog.domain';
import { BaseCommandRepository } from '../../../../../core/infrastructure/repositories/base-command.repository';

@Injectable()
export class BlogsCommandRepository extends BaseCommandRepository<BlogDocument, Blog> {
  constructor(
    @InjectModel('BlogDocument') protected blogModel: Model<BlogDocument>,
    private blogMapper: BlogMapper
  ) {
    super(blogModel);
  }

  toPersistence(blog: Blog): any {
    return this.blogMapper.toPersistence(blog);
  }

  toDomain(document: BlogDocument): Blog {
    return this.blogMapper.toDomain(document);
  }

  getEntityId(blog: Blog): string | undefined {
    return blog.id;
  }
}
