import { InjectModel } from '@nestjs/mongoose';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Model } from 'mongoose';
import { Namespace, Socket } from 'socket.io';
import { Chat, ChatDocument } from 'src/schema/chats.schema';
import { Talk, TalkDocument } from 'src/schema/talks.schema';
import { User, UserDocument } from 'src/schema/users.schema';

interface MessagePayload {
  roomName: string;
  message: string;
  nickname: string;
}

@WebSocketGateway({
  namespace: 'chat',
  cors: {
    origin: ['http://localhost:3000'],
  },
})
export class ChatsGateway {
  constructor(
    @InjectModel(Chat.name)
    private readonly chatsModel: Model<ChatDocument>,
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(Talk.name)
    private readonly talksModel: Model<TalkDocument>,
  ) {}
  @WebSocketServer() nsp: Namespace;
  afterInit() {
    this.nsp.adapter.on('leave-room', (room, id) => {
      console.log('Leave🦈', room, id);
    });
  }

  @SubscribeMessage('create-room')
  async handleCreateRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() userEmail: string,
  ) {
    const user = await this.userModel.findOne({ email: userEmail });

    const newChat = await this.chatsModel.create({
      attendant: ['admin@recommendkt.com', userEmail],
      roomName: socket.id,
      lastTalk: '',
      ownerImage: user.profileImg,
      lastTalker: user.nickname,
    });

    // socket.join(newChat.roomName);

    return { success: true, payload: newChat.roomName };
  }

  @SubscribeMessage('join-room')
  async handleJoinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    const targetChat = await this.chatsModel.findOne({ roomName });
    if (!targetChat) {
      return { success: false, payload: `Not exist ${roomName}` };
    }

    socket.join(targetChat.roomName); // join room

    const previousTalk = await this.talksModel
      .find({ roomName })
      .sort({ createdAt: 1 });

    const { profileImg } = await this.userModel
      .findOne({
        nickname: 'RecommendKoreaTrip',
      })
      .select('profileImg');

    return { success: true, payload: { previousTalk, profileImg } };
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() socket: Socket,
    @MessageBody() { message, roomName, nickname }: MessagePayload,
  ) {
    // 토크데이터 생성 저장
    const createTalkData = async () => {
      await this.talksModel.create({ roomName, nickname, contents: message });
    };
    // 마지막토크 업데이트
    const updateLastTalk = async () => {
      await this.chatsModel.findOneAndUpdate(
        { roomName },
        { lastTalk: message, lastTalker: nickname },
      );
    };

    async function doSomething() {
      await Promise.all([createTalkData(), updateLastTalk()]);
    }
    doSomething();

    console.log(socket.broadcast);
    // 방만든 애 _x0tw_tUM5tjB-NZAAAN

    // 나중에 들어온 애 FBxYENcIHNYScvblAAAP

    socket.broadcast
      .to(roomName)
      .emit('message', { nickname, contents: message });
    return { nickname, contents: message };
  }

  @SubscribeMessage('leave-room')
  handleLeaveRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ) {
    socket.leave(roomName); // leave room

    return { success: true };
  }
}
