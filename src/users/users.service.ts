import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserSignupDto } from './dto/users.signup.dto';
import { UsersRepository } from './users.repository';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

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
}
