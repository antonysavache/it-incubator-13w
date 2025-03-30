import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import {
  BLogDocument,
  BlogEntity,
  BlogModelType,
} from '../../domain/blog.entity';

@Injectable()
export class BlogsCommandRepository {
  constructor(@InjectModel(BlogEntity.name) private blogModel: BlogModelType) {}

  async save(blog: BLogDocument): Promise<BLogDocument> {
    return blog.save();
  }

  async findById(id: string): Promise<BLogDocument | null> {
    return this.blogModel.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: id });
    return result.deletedCount === 1;
  }

  async update(id: string, updateData: Partial<BlogEntity>): Promise<boolean> {
    const result = await this.blogModel.updateOne(
      { _id: id },
      { $set: updateData },
    );
    return result.modifiedCount === 1;
  }
}
