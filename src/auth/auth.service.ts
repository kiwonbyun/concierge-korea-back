import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/users.repository';

import * as bcrypt from 'bcrypt';
import { UserLoginDto } from 'src/users/dto/users.login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async jwtLogin(body: UserLoginDto) {
    const { email, password } = body;

    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Please confirm your email and password');
    }

    const isValidPassword: boolean = await bcrypt.compare(
      password,
      user.password,
    );
    if (!isValidPassword) {
      throw new UnauthorizedException('Please confirm your email and password');
    }

    const payload = {
      email,
      sub: user.id,
      nickname: user.nickname,
      profileImg: user.profileImg,
      country: user.country,
    };

    return { token: this.jwtService.sign(payload) };
  }
}
