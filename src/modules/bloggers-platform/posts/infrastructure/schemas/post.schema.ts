import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  } 
})
export class PostDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  shortDescription: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  blogId: string;

  @Prop({ required: true })
  blogName: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
  
  @Prop({ 
    type: {
      likesCount: { type: Number, default: 0 },
      dislikesCount: { type: Number, default: 0 },
      myStatus: { type: String, default: 'None' },
      newestLikes: { type: Array, default: [] }
    },
    default: {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: []
    }
  })
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: any[];
  };
}

export const PostSchema = SchemaFactory.createForClass(PostDocument);
