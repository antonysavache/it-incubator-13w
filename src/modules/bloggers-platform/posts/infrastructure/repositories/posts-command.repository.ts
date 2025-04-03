import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';
import { PostMapper } from '../mappers/post.mapper';
import { Post } from '../../domain/post.domain';

@Injectable()
export class PostsCommandRepository {
  constructor(
    @InjectModel('PostDocument') private postModel: Model<PostDocument>,
    private postMapper: PostMapper
  ) {}

  async save(post: Post): Promise<PostDocument> {
    const persistenceData = this.postMapper.toPersistence(post);
    
    if (post.id) {
      // Update existing post
      const updated = await this.postModel.findByIdAndUpdate(
        post.id,
        persistenceData,
        { new: true }
      ).exec();
      
      if (!updated) {
        throw new Error(`Post with id ${post.id} not found`);
      }
      
      return updated;
    } else {
      // Create new post
      const newPost = new this.postModel(persistenceData);
      return newPost.save();
    }
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.postModel.deleteOne({ _id: id }).exec();
    return result.deletedCount > 0;
  }

  async deleteAllByBlogId(blogId: string): Promise<number> {
    const result = await this.postModel.deleteMany({ blogId }).exec();
    return result.deletedCount;
  }
}
