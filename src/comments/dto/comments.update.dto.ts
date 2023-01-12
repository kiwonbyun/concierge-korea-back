import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CommentsUpdateDto {
  @IsNotEmpty()
  @IsString()
  commentId: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  contents: string;
}
