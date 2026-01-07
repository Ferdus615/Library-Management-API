import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoanBookResponseDto {
  @ApiProperty({ description: 'The unique UUID of the book', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The title of the borrowed book',
    example: 'The Catcher in the Rye',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The author of the book',
    example: 'J.D. Salinger',
  })
  @Expose()
  author: string;

  @ApiProperty({ description: 'The 13-digit ISBN', example: '9780316769488' })
  @Expose()
  isbn: string;
}
