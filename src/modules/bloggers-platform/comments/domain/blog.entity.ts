import { Prop, Schema } from '@nestjs/mongoose';

@Schema()
export class BlogEntity {
  @Prop({ required: true, maxlength: 15 })
  name: string;

  @Prop({ maxlength: 500 })
  description: string;

  @Prop({
    maxLength: 100,
    match:
      /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  })
  websiteUrl: string;
}
