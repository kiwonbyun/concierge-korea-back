import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class ReviewCreateDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  title: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(400)
  contents: string;

  @IsString()
  @IsOptional()
  tags?: string;

  @IsOptional()
  images?: Express.Multer.File[];
}
