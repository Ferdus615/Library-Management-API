import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { BookCategoryResponseDto } from './bookCategoryResponseDto.dto';

export class ResponseBookDto {
  @ApiProperty({
    description: 'The unique identifier of the book record.',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    format: 'uuid', // Suggests the format in Swagger UI
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The ISBN (International Standard Book Number).',
    example: '9780743273565',
    maxLength: 13,
  })
  @Expose()
  isbn: string;

  @ApiProperty({
    description: 'The full title of the book.',
    example: 'The Great Gatsby',
    maxLength: 150,
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The author of the book.',
    example: 'F. Scott Fitzgerald',
    maxLength: 100,
  })
  @Expose()
  author: string;

  @ApiProperty({
    description: 'The year the book was published.',
    example: 1925,
    type: Number,
  })
  @Expose()
  publication_year: number;

  @ApiProperty({
    description: 'The total number of copies owned by the library.',
    example: 20,
    type: Number,
  })
  @Expose()
  total_copies: number;

  @ApiProperty({
    description: 'The number of copies that are damaged or lost.',
    example: 2,
    type: Number,
  })
  @Expose()
  damaged_copies: number;

  @ApiProperty({
    description:
      'The number of copies currently available for loan (Total - Damaged).',
    example: 18,
    type: Number,
  })
  @Expose()
  available_copies: number;

  @ApiProperty({ type: () => BookCategoryResponseDto })
  @Expose()
  @Type(() => BookCategoryResponseDto)
  category?: BookCategoryResponseDto;
}
