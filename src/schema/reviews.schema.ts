import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty, IsString } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';

export type ReviewDocument = HydratedDocument<Review>;

interface Iwriter {
  id: string;
  email: string;
  nickname: string;
  country: string;
  birth: string;
  profileImg: string;
  requestList: any[];
}

const option: SchemaOptions = { timestamps: true, collection: 'reviews' };

@Schema(option)
export class Review extends Document {
  @Prop()
  @IsString()
  @IsNotEmpty()
  title: string;

  @Prop()
  @IsString()
  @IsNotEmpty()
  contents: string;

  @Prop({ type: Types.ObjectId })
  writer: Iwriter;

  @Prop({ default: [] })
  images: string[];

  @Prop({ default: '' })
  @IsString()
  tags: string;

  @Prop({ default: [] })
  comments: any[];
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
