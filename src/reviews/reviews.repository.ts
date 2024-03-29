import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from 'src/schema/reviews.schema';

import { ReviewCreateDto } from './dto/review.create.dto';

export class Page<T> {
  pageSize: number;
  nextPage: number;
  hasNextPage: boolean;
  items: T[];
  constructor(totalCount: number, pageSize: number, items: T[], page: number) {
    this.pageSize = pageSize;
    this.items = items;
    this.hasNextPage = Math.ceil(totalCount / pageSize) > page + 1;
    this.nextPage = this.hasNextPage ? page + 1 : null;
  }
}
@Injectable()
export class ReviewsRepository {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: Model<ReviewDocument>,
  ) {}

  async getAllReviews(page: number, size: number) {
    const total = await this.reviewModel.count();
    if (Math.ceil(total / size) < page) {
      throw new HttpException('please check query string', 400);
    }
    const result = await this.reviewModel
      .find()
      .skip(page * size)
      .limit(size);
    return new Page(total, size, result, page);
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
