import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chat, ChatDocument } from 'src/schema/chats.schema';
import { Talk, TalkDocument } from 'src/schema/talks.schema';
import { User } from 'src/schema/users.schema';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatsModel: Model<ChatDocument>,
    @InjectModel(Talk.name)
    private readonly talksModel: Model<TalkDocument>,
  ) {}

  async getChatsList(user: User) {
    const { email } = user;
    const myChatLists = await this.chatsModel.find({ attendant: email });

    return myChatLists;
  }
}
