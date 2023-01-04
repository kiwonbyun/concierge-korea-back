import { IsOptional, IsPhoneNumber, IsString, Matches } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9]+$/g, {
    message: 'nickname should consist of letter and digits',
  })
  nickname?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  @IsPhoneNumber(null)
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  birth?: string;
}
