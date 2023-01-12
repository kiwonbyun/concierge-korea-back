import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CommentsCreateDto {
  @IsNotEmpty()
  @IsString()
  reviewId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  contents: string;
}
