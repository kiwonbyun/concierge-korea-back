import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/users.schema';

import { UserSignupDto } from './dto/users.signup.dto';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async existByEmail(email: string): Promise<any> {
    const result = await this.userModel.exists({ email });
    return result;
  }

  async create(user: UserSignupDto) {
    const { email, password, nickname, country, birth, profileImg } = user;

    try {
      return await this.userModel.create({
        email,
        password,
        nickname,
        country: country ?? 'global',
        birth: birth ?? null,
        profileImg:
          profileImg ??
          'https://concierge-korea.s3.amazonaws.com/base/defaultProfile.webp',
      });
    } catch (e) {
      throw new HttpException('db error', 500);
    }
  }

  async findByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }
  async findByNickname(nickname: string) {
    return await this.userModel.findOne({ nickname });
  }

  async findUserByIdWithoutPassword(id: string) {
    try {
      const user = await this.userModel.findById(id).select('-password');
      return user;
    } catch (e) {
      throw new UnauthorizedException('User not found');
    }
  }
}
