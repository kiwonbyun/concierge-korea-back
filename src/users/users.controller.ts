import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorator/user.decorator';
import { User } from 'src/schema/users.schema';
import { UserChangePasswordDto } from './dto/user.changepw.dto';
import { EmailCheckDto } from './dto/user.email.check.dto';
import { NicknameCheckDto } from './dto/user.nickname.check.dto';
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
  async signup(@Body() body: UserSignupDto) {
    await this.usersService.singUp(body);
    return this.authService.jwtLogin(body);
  }

  @Post('login')
  login(@Body() body: UserLoginDto) {
    return this.authService.jwtLogin(body);
  }

  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleLogin(): Promise<void> {
    // redirect google login page
  }

  @Get('/google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req: Request, @Res() res: Response) {
    if (!req.user) {
      throw new UnauthorizedException('No user from google');
    }

    const result = await this.usersService.googleLogin(req.user);

    if (result) {
      res.redirect('http://localhost:3000/login/success/' + result.token);
    } else {
      res.redirect('http://localhost:3000/login/fail/');
    }
  }

  @Post('/check/email')
  emailCheck(@Body() body: EmailCheckDto) {
    return this.usersService.emailCheck(body.email);
  }

  @Post('/check/nickname')
  nicknameCheck(@Body() body: NicknameCheckDto) {
    return this.usersService.nicknameCheck(body.nickname);
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
