import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserSignupDto } from './dto/users.signup.dto';
import { UsersRepository } from './users.repository';

import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dto/user.update.dto';
import { User } from 'src/schema/users.schema';
import { UserChangePasswordDto } from './dto/user.changepw.dto';
import { AuthService } from 'src/auth/auth.service';
import { AwsService } from 'src/aws.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly awsService: AwsService,
  ) {}

  async googleLogin(user: any) {
    const { name, email, providerId, profileImage } = user;

    const isExist = await this.usersRepository.existByEmail(email);

    if (!isExist) {
      const password = providerId + name;
      const hashedPassword = await bcrypt.hash(password, 8);
      const user = await this.usersRepository.create({
        email,
        password: hashedPassword,
        nickname: email.split('@')[0],
        profileImg: profileImage,
      });

      return await this.authService.jwtLogin({
        email: user.email,
        password: providerId + name,
      });
    } else {
      const user = await this.usersRepository.findByEmail(email);

      return await this.authService.jwtLogin({
        email: user.email,
        password: providerId + name,
      });
    }
  }

  async singUp(body: UserSignupDto) {
    const { email, password, nickname, country, birth } = body;

    const isExist = await this.usersRepository.existByEmail(email);
    if (isExist) {
      throw new UnauthorizedException('This email already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 8);

    const user = await this.usersRepository.create({
      email,
      password: hashedPassword,
      nickname,
      country,
      birth,
    });

    return user.readOnlyData;
  }

  async updateUser(
    user: User,
    body: UserUpdateDto,
    file?: Express.Multer.File,
  ) {
    const { nickname, country, birth } = body;

    const currentUser = await this.usersRepository.findUserByIdWithoutPassword(
      user.id,
    );
    currentUser.nickname = nickname;
    currentUser.country = country;
    currentUser.birth = birth;

    if (file) {
      const result = await this.awsService.uploadFileToS3('new_profile', file);
      const newUrl = this.awsService.getAwsS3FileUrl(result.key);
      currentUser.profileImg = newUrl;
    }

    try {
      await currentUser.save();
      return { success: true };
    } catch (e) {
      throw new HttpException('db error', 404);
    }
  }

  async changePassword(user: User, body: UserChangePasswordDto) {
    const { before, after } = body;
    const currentUser = await this.usersRepository.findByEmail(user.email);

    const isValidPassword = await bcrypt.compare(before, currentUser.password);

    if (isValidPassword) {
      const hashedNewPassword = await bcrypt.hash(after, 8);
      currentUser.password = hashedNewPassword;
      await currentUser.save();
      return { success: true };
    } else {
      throw new UnauthorizedException(
        'Please check the entered information again',
      );
    }
  }

  async emailCheck(email: string) {
    const user = await this.usersRepository.findByEmail(email);
    if (user) {
      return { isUnique: false };
    }
    return { isUnique: true };
  }

  async nicknameCheck(nickname: string) {
    const user = await this.usersRepository.findByNickname(nickname);
    if (user) {
      return { isUnique: false };
    }
    return { isUnique: true };
  }
}
