import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({
    description: 'The ISBN of the book (usually 10 or 13 characters)',
    example: '9780743273565',
    maxLength: 13, // Explicitly set for Swagger UI
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(13)
  isbn: string;

  @ApiProperty({
    description: 'The title of the book',
    example: 'Pride and Prejudice',
    maxLength: 150, // Explicitly set for Swagger UI
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'Jane Austen',
    maxLength: 100, // Explicitly set for Swagger UI
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  author: string;

  @ApiProperty({
    description: 'The year the book was published (must be 1900 or later)',
    example: 1995,
    type: Number,
    minimum: 1900, // Explicitly set for Swagger UI
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1900)
  publication_year: number;

  @ApiProperty({
    description: 'The total number of copies available (must be 1 or more)',
    example: 10,
    type: Number,
    minimum: 1, // Explicitly set for Swagger UI
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  total_copies: number;
}
