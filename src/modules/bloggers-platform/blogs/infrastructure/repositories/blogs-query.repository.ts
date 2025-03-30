import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  BLogDocument,
  BlogEntity,
  BlogModelType,
} from '../../domain/blog.entity';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectModel(BlogEntity.name) private blogModel: BlogModelType) {}


  async findById(id: string): Promise<BLogDocument | null> {
    return this.blogModel.findById(id);
  }

  async getAll(): Promise<BLogDocument[]> {
    return this.blogModel.find({}).exec();
  }
}
