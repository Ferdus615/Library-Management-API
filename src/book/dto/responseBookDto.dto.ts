import { ApiProperty } from '@nestjs/swagger';
import { Books } from '../entities/book.entity';
import { IsInt, IsString } from 'class-validator';

export class ResponseBookDto {
  @ApiProperty({
    description: 'The unique identifier of the book record.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    format: 'uuid', // Suggests the format in Swagger UI
  })
  @IsString()
  id: string;

  @ApiProperty({
    description: 'The ISBN (International Standard Book Number).',
    example: '9780743273565',
    maxLength: 13,
  })
  @IsString()
  isbn: string;

  @ApiProperty({
    description: 'The full title of the book.',
    example: 'The Great Gatsby',
    maxLength: 150,
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: 'The author of the book.',
    example: 'F. Scott Fitzgerald',
    maxLength: 100,
  })
  @IsString()
  author: string;

  @ApiProperty({
    description: 'The year the book was published.',
    example: 1925,
    type: Number,
  })
  @IsInt()
  publication_year: number;

  @ApiProperty({
    description: 'The total number of copies owned by the library.',
    example: 20,
    type: Number,
  })
  @IsInt()
  total_copies: number;

  @ApiProperty({
    description: 'The number of copies that are damaged or lost.',
    example: 2,
    type: Number,
  })
  @IsInt()
  damaged_copies: number;

  @ApiProperty({
    description:
      'The number of copies currently available for loan (Total - Damaged).',
    example: 18,
    type: Number,
  })
  @IsInt()
  available_copies: number;

  constructor(book: Books) {
    this.id = book.id;
    this.isbn = book.isbn;
    this.title = book.title;
    this.author = book.author;
    this.publication_year = book.publication_year;
    this.total_copies = book.total_copies;
    this.damaged_copies = book.damaged_copies;
    this.available_copies = book.available_copies;
  }
}
