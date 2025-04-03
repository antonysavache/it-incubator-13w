import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { CreateBlogDomainDto } from '../../blogs/domain/dto/create-blog.domain.dto';

@Schema()
export class LikesEntity {
  @Prop({ required: true, maxlength: 15 })
  name: string;

  @Prop({ maxlength: 500, required: true })
  description: string;

  @Prop({
    required: true,
    maxLength: 100,
    match:
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  })
  websiteUrl: string;

  createdAt: Date;

  @Prop({ default: true })
  isMembership: boolean;

  static createBlog(dto: CreateBlogDomainDto) {
    return {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: true,
      createdAt: Date.now(),
    };
  }
}

export const BlogSchema = SchemaFactory.createForClass(LikesEntity);

BlogSchema.loadClass(LikesEntity);
export type BLogDocument = HydratedDocument<LikesEntity>;
export type BlogModelType = Model<BLogDocument> & typeof LikesEntity;
