import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(22)
  before: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(22)
  after: string;
}
