import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';

export type TalkDocument = HydratedDocument<Talk>;

const option: SchemaOptions = { timestamps: true, collection: 'talks' };

@Schema(option)
export class Talk extends Document {
  @Prop()
  @IsNotEmpty()
  roomName: string;

  @Prop()
  @IsNotEmpty()
  nickname: string;

  @Prop()
  @IsNotEmpty()
  contents: string;
}

export const TalkSchema = SchemaFactory.createForClass(Talk);
