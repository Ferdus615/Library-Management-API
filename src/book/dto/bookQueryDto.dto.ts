import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsInt, Min, IsUUID } from 'class-validator';

export class BookQueryDto {
  @ApiPropertyOptional({
    description: 'Search by book title (case-insensitive)',
    example: 'Pride',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    description: 'Search by book author (case-insensitive)',
    example: 'Jane Austen',
  })
  @IsOptional()
  @IsString()
  author?: string;

  @ApiPropertyOptional({
    description: 'Search by ISBN',
    example: '9780743273565',
  })
  @IsOptional()
  @IsString()
  isbn?: string;

  @ApiPropertyOptional({
    description: 'Filter by category ID',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Page number for pagination',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    default: 10,
    minimum: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;
}
