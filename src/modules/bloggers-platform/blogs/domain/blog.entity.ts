import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { CreateBlogDomainDto } from './dto/create-blog.domain.dto';
import { HydratedDocument, Model } from 'mongoose';

@Schema()
export class BlogEntity {
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

  createdAt: number;

  @Prop({ default: true })
  isMembership: boolean;

  static createBlog(dto: CreateBlogDomainDto) {
    const blog = new this();
    blog.name = dto.name;
    blog.description = dto.description;
    blog.websiteUrl = dto.websiteUrl;
    blog.isMembership = true;
    blog.createdAt = Date.now();
    return blog;
  }
}

export const BlogSchema = SchemaFactory.createForClass(BlogEntity);

BlogSchema.loadClass(BlogEntity);
export type BLogDocument = HydratedDocument<BlogEntity>;
export type BlogModelType = Model<BLogDocument> & typeof BlogEntity;
