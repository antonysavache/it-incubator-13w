import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreatePostDomainDto } from './dto/create-post.domain.dto';
import { ExtendedLikes } from '../../likes/domain/models/extended-likes.interface';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class PostEntity {
  id: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop()
  blogName: string;

  @Prop()
  createdAt: Date;

  @Prop()
  extendedLikesInfo: ExtendedLikes;

  static createPost(dto: CreatePostDomainDto) {
    return {
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: dto.blogId,
      blogName: dto.blogName,
      createdAt: Date.now(),
    };
  }
}

export const PostSchema = SchemaFactory.createForClass(PostEntity);

PostSchema.loadClass(PostEntity);
export type PostDocument = HydratedDocument<PostEntity>;
export type PostModelType = Model<PostDocument> & typeof PostEntity;
