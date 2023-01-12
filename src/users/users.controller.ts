import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/schema/users.schema';
import { UserChangePasswordDto } from './dto/user.changepw.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UserLoginDto } from './dto/users.login.dto';
import { UserSignupDto } from './dto/users.signup.dto';
import { UsersService } from './users.service';

@Controller('api/user')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  signup(@Body() body: UserSignupDto) {
    return this.usersService.singUp(body);
  }

  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.authService.jwtLogin(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  getCurrentUser(@CurrentUser() user: User) {
    return user.readOnlyData;
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  updateUserInfo(@CurrentUser() user: User, @Body() body: UserUpdateDto) {
    return this.usersService.updateUser(user, body);
  }

  @Post('info')
  @UseGuards(JwtAuthGuard)
  changePassword(
    @CurrentUser() user: User,
    @Body() body: UserChangePasswordDto,
  ) {
    return this.usersService.changePassword(user, body);
  }
}
