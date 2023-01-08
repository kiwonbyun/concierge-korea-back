import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schema/reviews.schema';

import { ReviewCreateDto } from './dto/review.create.dto';

@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async getAllReviews() {
    return await this.reviewModel.find();
  }

  async createReview(writer: any, newUrlArr: string[], body: ReviewCreateDto) {
    const { title, contents, tags } = body;
    try {
      return await this.reviewModel.create({
        title,
        contents,
        tags,
        writer,
        images: newUrlArr,
      });
    } catch (e) {
      throw new HttpException('db error', 404);
    }
  }

  async getReviewById(id: string) {
    try {
      return await this.reviewModel.findById({ _id: id });
    } catch (e) {
      throw new NotFoundException('There are no posts');
    }
  }

  async deleteReview(id: string) {
    try {
      return await this.reviewModel.deleteOne({ _id: id });
    } catch (e) {
      throw new NotFoundException('There are no posts');
    }
  }
}
