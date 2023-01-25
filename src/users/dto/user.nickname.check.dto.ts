import { IsNotEmpty, IsString, Matches, MaxLength } from 'class-validator';

export class NicknameCheckDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(22)
  @Matches(/^[a-zA-Z0-9]+$/g, {
    message: 'nickname should consist of letter and digits',
  })
  nickname: string;
}
