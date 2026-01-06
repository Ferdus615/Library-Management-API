import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseCategoryDto {
  @ApiProperty({ example: 'e123-f456-7890', description: 'Internal UUID' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'History' })
  @Expose()
  name: string;

  @ApiProperty({ example: 'Books related to historical events.' })
  @Expose()
  description: string;

  @ApiProperty({ example: '2026-01-06T16:43:26.293Z' })
  @Expose()
  created_at: Date;
}
