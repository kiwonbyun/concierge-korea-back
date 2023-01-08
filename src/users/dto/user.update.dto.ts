import { IsOptional, IsString, Matches } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9]+$/g, {
    message: 'nickname should consist of letter and digits',
  })
  nickname: string;

  @IsString()
  country: string;

  // @IsOptional()
  // @IsString()
  // @IsPhoneNumber(null)
  // phoneNumber?: string;

  @IsOptional()
  @IsString()
  birth?: string;
}
