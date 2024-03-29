import { IsOptional, IsString, Matches } from 'class-validator';

export class UserUpdateDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9]+$/, {
    message: 'nickname should consist of letter and digits',
  })
  nickname: string;

  @IsString()
  country: string;

  @IsOptional()
  image?: Express.Multer.File;

  @IsOptional()
  @IsString()
  birth?: string;
}
