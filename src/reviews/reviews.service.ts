import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AwsService } from 'src/aws.service';
import { User } from 'src/schema/users.schema';
import { UsersRepository } from 'src/users/users.repository';
import { ReviewCreateDto } from './dto/review.create.dto';
import { ReviewsRepository } from './reviews.repository';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly reviewsRepository: ReviewsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly awsService: AwsService,
  ) {}

  async getAllReviews(page: number, size: number) {
    if (isNaN(page) || isNaN(size)) {
      throw new HttpException('please check params', 400);
    }
    return await this.reviewsRepository.getAllReviews(page, size);
  }

  async createReview(data: any) {
    const { user, files, body } = data;
    const writer = await this.usersRepository.findUserByIdWithoutPassword(
      user.id,
    );

    const result = await Promise.all(
      files.map((file: Express.Multer.File) =>
        this.awsService.uploadFileToS3('review_image', file),
      ),
    );

    const newUrlArr = result.map((obj) =>
      this.awsService.getAwsS3FileUrl(obj.key),
    );
    const review = await this.reviewsRepository.createReview(
      writer.readOnlyData,
      newUrlArr,
      body,
    );
    return review;
  }

  async getDetailReview(id: string) {
    const result = await this.reviewsRepository.getReviewById(id);

    if (!result) {
      throw new NotFoundException('There are no posts');
    }
    return result;
  }

  async deleteReview(id: string) {
    const { deletedCount } = await this.reviewsRepository.deleteReview(id);

    if (deletedCount === 1) {
      return { success: true };
    } else {
      throw new NotFoundException('There are no posts');
    }
  }

  async updateReview(user: User, id: string, body: ReviewCreateDto) {
    const { title, contents, tags } = body;
    const targetReview = await this.reviewsRepository.getReviewById(id);

    if (String(targetReview.writer.id) !== user.id) {
      throw new UnauthorizedException('Please check user information again');
    }

    targetReview.title = title;
    targetReview.contents = contents;
    targetReview.tags = tags;
    const newReview = await targetReview.save();
    return newReview;
  }
}
