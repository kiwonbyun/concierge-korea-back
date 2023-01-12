import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/schema/users.schema';
import { UsersRepository } from 'src/users/users.repository';
import { CommentsRepository } from './comments.repository';
import { CommentsCreateDto } from './dto/comments.create.dto';
import { CommentsUpdateDto } from './dto/comments.update.dto';

@Injectable()
export class CommentsService {
  constructor(
    private readonly commentsRepository: CommentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async createComment(user: User, body: CommentsCreateDto) {
    console.log({ user, body });
    const { contents, reviewId } = body;
    const writer = await this.usersRepository.findUserByIdWithoutPassword(
      user.id,
    );

    return this.commentsRepository.create(writer, reviewId, contents);
  }

  async getComments(reviewId: string) {
    return await this.commentsRepository.getCommentsByReviewId(reviewId);
  }

  async updateComment(user: User, body: CommentsUpdateDto) {
    const { contents, commentId } = body;

    const targetComment = await this.commentsRepository.getCommentByCommentId(
      commentId,
    );

    if (targetComment.writer.email !== user.email) {
      throw new UnauthorizedException('Unauthorized access');
    }

    try {
      targetComment.contents = contents;
      return await targetComment.save();
    } catch (e) {
      throw new HttpException('db error', 500);
    }
  }

  async deleteComment(user: User, commentId: string) {
    const targetComment = await this.commentsRepository.getCommentByCommentId(
      commentId,
    );
    if (targetComment.writer.email !== user.email) {
      throw new UnauthorizedException('Unauthorized access');
    }

    try {
      await this.commentsRepository.deleteById(commentId);
      return { success: true };
    } catch (e) {
      return { success: false };
    }
  }
}
