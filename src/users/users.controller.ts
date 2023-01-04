import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { UserChangePasswordDto } from './dto/user.changepw.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserLoginDto } from './dto/users.login.dto';
import { UserSignupDto } from './dto/users.signup.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  signup(@Body() body: UserSignupDto) {
    return body;
  }

  @Post('login')
  login(@Body() body: UserLoginDto) {
    return body;
  }

  @Get()
  getCurrentUser() {
    return 'getCurrentUser';
  }

  @Put()
  updateUserInfo(@Body() body: UserUpdateDto) {
    return body;
  }

  @Post('info')
  updatePassword(@Body() body: UserChangePasswordDto) {
    return body;
  }
}
