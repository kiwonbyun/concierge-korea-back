import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/schema/users.schema';
import { ReviewCreateDto } from './dto/review.create.dto';
import { ReviewsService } from './reviews.service';

@Controller('api/review')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get()
  getAllReviews(@Query('page') page: number, @Query('size') size: number) {
    return this.reviewsService.getAllReviews(page, size);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('images'))
  createReview(
    @CurrentUser() user: User,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() body: ReviewCreateDto,
  ) {
    return this.reviewsService.createReview({ user, body, files });
  }

  @Get(':reviewId')
  getDetailReview(@Param('reviewId') reviewId: string) {
    return this.reviewsService.getDetailReview(reviewId);
  }

  @Delete(':reviewId')
  @UseGuards(JwtAuthGuard)
  deleteReview(@Param('reviewId') reviewId: string) {
    return this.reviewsService.deleteReview(reviewId);
  }

  @Put(':reviewId')
  @UseGuards(JwtAuthGuard)
  updateReview(
    @CurrentUser() user: User,
    @Param('reviewId') reviewId: string,
    @Body() body: ReviewCreateDto,
  ) {
    return this.reviewsService.updateReview(user, reviewId, body);
  }
}
