import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsNotEmpty } from 'class-validator';
import { Document, HydratedDocument } from 'mongoose';

export type ChatDocument = HydratedDocument<Chat>;

const option: SchemaOptions = { timestamps: true, collection: 'chats' };

@Schema(option)
export class Chat extends Document {
  @Prop()
  @IsNotEmpty()
  attendant: string[];

  @Prop()
  @IsNotEmpty()
  roomName: string;

  @Prop()
  @IsNotEmpty()
  lastTalk: string;

  @Prop()
  @IsNotEmpty()
  lastTalker: string;

  @Prop()
  @IsNotEmpty()
  ownerImage: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);

//63e8c7963feee003d04529ed  어드민 아이디
