import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/schema/comments.schema';
import { User } from 'src/schema/users.schema';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentsModel: Model<CommentDocument>,
  ) {}

  async create(writer: User, reviewId: string, contents: string) {
    try {
      const newComment = await this.commentsModel.create({
        writer,
        reviewId,
        contents,
      });
      return newComment;
    } catch (e) {
      throw new HttpException('db error', 500);
    }
  }

  async getCommentsByReviewId(id: string) {
    const one = await this.commentsModel.findOne({ reviewId: id });
    if (!one) {
      throw new HttpException('please check review id', 500);
    }
    const targetComments = await this.commentsModel.find({ reviewId: id });
    return targetComments;
  }

  async getCommentByCommentId(id: string) {
    const target = await this.commentsModel.findOne({ _id: id });
    if (!target) {
      throw new HttpException('please check comment id', 500);
    }
    return target;
  }

  async deleteById(id: string) {
    return await this.commentsModel.findByIdAndDelete({ _id: id });
  }
}
