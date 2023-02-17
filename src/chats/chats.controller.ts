import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/schema/users.schema';
import { ChatsService } from './chats.service';

@Controller('api/chat')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  getComments(@CurrentUser() user: User) {
    return this.chatsService.getChatsList(user);
  }
}
