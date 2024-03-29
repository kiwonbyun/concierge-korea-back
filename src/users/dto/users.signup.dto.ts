import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UserSignupDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(22)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(22)
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'nickname should consist of letter and digits',
  })
  nickname: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  birth?: string;

  @IsOptional()
  @IsString()
  profileImg?: string;
}
