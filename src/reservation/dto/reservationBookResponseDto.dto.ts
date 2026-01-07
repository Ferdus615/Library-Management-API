import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReservationBookResponseDto {
  @ApiProperty({
    description: 'The unique UUID of the book',
    example: 'f7b4c1a2-3b9d-4e5f-8c1a-2b3c4d5e6f7g',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The full title of the book',
    example: 'The Great Gatsby',
  })
  @Expose()
  title: string;

  @ApiProperty({
    description: 'The primary author of the book',
    example: 'F. Scott Fitzgerald',
  })
  @Expose()
  author: string;

  @ApiProperty({
    description: 'The 13-digit International Standard Book Number',
    example: '9780743273565',
  })
  @Expose()
  isbn: string;
}
