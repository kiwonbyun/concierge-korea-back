import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/schema/users.schema';
import { CommentsService } from './comments.service';
import { CommentsCreateDto } from './dto/comments.create.dto';
import { CommentsUpdateDto } from './dto/comments.update.dto';

@Controller('api/comment')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  createComment(@CurrentUser() user: User, @Body() body: CommentsCreateDto) {
    return this.commentsService.createComment(user, body);
  }

  @Get(':reviewId')
  getComments(@Param('reviewId') reviewId: string) {
    return this.commentsService.getComments(reviewId);
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateComment(@CurrentUser() user: User, @Body() body: CommentsUpdateDto) {
    return this.commentsService.updateComment(user, body);
  }

  @Delete(':commentId')
  @UseGuards(JwtAuthGuard)
  deleteComment(
    @CurrentUser() user: User,
    @Param('commentId') commentId: string,
  ) {
    return this.commentsService.deleteComment(user, commentId);
  }
}
