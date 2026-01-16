import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BookCategoryResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the category.',
    example: 'a0hebc09-5c0b-4eg8-bb6d-6kb9bd360a11',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The name of the category.',
    example: 'fiction',
  })
  @Expose()
  name: string;
}
