import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'users' })
export class UserDocument extends Document {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ required: true, default: () => new Date() })
  createdAt: Date;

  @Prop()
  confirmationCode: string;

  @Prop({ default: false })
  emailConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserDocument);
