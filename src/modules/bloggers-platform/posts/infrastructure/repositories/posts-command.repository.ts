import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PostDocument } from '../schemas/post.schema';
import { PostMapper } from '../mappers/post.mapper';
import { Post } from '../../domain/post.domain';
import { BaseCommandRepository } from '../../../../../core/infrastructure/repositories/base-command.repository';

@Injectable()
export class PostsCommandRepository extends BaseCommandRepository<PostDocument, Post> {
  constructor(
    @InjectModel('PostDocument') protected postModel: Model<PostDocument>,
    private postMapper: PostMapper
  ) {
    super(postModel);
  }

  toPersistence(post: Post): any {
    return this.postMapper.toPersistence(post);
  }

  toDomain(document: PostDocument): Post {
    return this.postMapper.toDomain(document);
  }

  getEntityId(post: Post): string | undefined {
    return post.id;
  }

  async deleteAllByBlogId(blogId: string): Promise<number> {
    const result = await this.model.deleteMany({ blogId }).exec();
    return result.deletedCount;
  }
}
