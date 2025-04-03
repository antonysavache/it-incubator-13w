import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BlogDocument } from '../schemas/blog.schema';
import { BlogMapper } from '../mappers/blog.mapper';
import { Blog } from '../../domain/blog.domain';

@Injectable()
export class BlogsCommandRepository {
  constructor(
    @InjectModel('BlogDocument') private blogModel: Model<BlogDocument>,
    private blogMapper: BlogMapper
  ) {}

  async save(blog: Blog): Promise<BlogDocument> {
    const persistenceData = this.blogMapper.toPersistence(blog);
    
    if (blog.id) {
      // Update existing blog
      const updated = await this.blogModel.findByIdAndUpdate(
        blog.id,
        persistenceData,
        { new: true }
      ).exec();
      
      if (!updated) {
        throw new Error(`Blog with id ${blog.id} not found`);
      }
      
      return updated;
    } else {
      // Create new blog
      const newBlog = new this.blogModel(persistenceData);
      return newBlog.save();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.blogModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }
}