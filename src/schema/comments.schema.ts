import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

interface Iwriter {
  id: string;
  email: string;
  nickname: string;
  country: string;
  birth: string;
  profileImg: string;
  requestList: any[];
}

const option: SchemaOptions = { timestamps: true, collection: 'comments' };

@Schema(option)
export class Comment extends Document {
  @Prop()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @Prop({ type: Types.ObjectId })
  @IsNotEmpty()
  writer: Iwriter;

  @Prop()
  @IsString()
  @IsNotEmpty()
  reviewId: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
