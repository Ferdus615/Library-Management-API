import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  isbn: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  author: string;

  @IsNotEmpty()
  @IsString()
  edition: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1990)
  publication_year: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  total_copies: number;
}
