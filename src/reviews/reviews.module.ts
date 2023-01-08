import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AwsService } from 'src/aws.service';
import { Review, ReviewSchema } from 'src/schema/reviews.schema';
import { UsersModule } from 'src/users/users.module';
import { ReviewsController } from './reviews.controller';
import { ReviewsRepository } from './reviews.repository';
import { ReviewsService } from './reviews.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './upload',
      storage: memoryStorage(),
    }),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    UsersModule,
  ],
  controllers: [ReviewsController],
  providers: [ReviewsService, ReviewsRepository, AwsService],
})
export class ReviewsModule {}
