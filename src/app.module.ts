import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { LoggerMiddleware } from './common/middleware/Logger.middleware';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { HealthController } from './health/health.controller';
import { ChatsModule } from './chats/chats.module';
import mongoose from 'mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    forwardRef(() => UsersModule),
    ReviewsModule,
    AuthModule,
    CommentsModule,
    ChatsModule,
    TerminusModule,
    HttpModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule implements NestModule {
  private readonly isDev: boolean = process.env.MODE === 'dev';
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
    mongoose.set('debug', this.isDev);
  }
}
