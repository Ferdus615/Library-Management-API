import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  MaxLength,
  IsOptional,
  IsUUID,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';
export class UpdateBookDto {
  @ApiProperty({
    description: 'The new title of the book.',
    example: 'Pride and Prejudice (Annotated Edition)',
    maxLength: 150,
    required: false, // Indicates the field is optional for the update
  })
  @IsString()
  @MaxLength(150)
  @IsOptional()
  title?: string;

  @ApiProperty({
    description: 'The new author of the book.',
    example: 'Jane Austen and modern scholar',
    maxLength: 100,
    required: false, // Indicates the field is optional
  })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  author?: string;

  @ApiProperty({
    description: 'The number of new copies added to the total stock.',
    example: 5,
    type: Number,
    required: false, // Indicates the field is optional
  })
  @IsNumber()
  @IsOptional()
  copies_added?: number;

  @ApiProperty({
    description: 'The absolute number of total copies.',
    example: 10,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  total_copies?: number;

  @ApiProperty({
    description: 'The absolute number of damaged copies.',
    example: 2,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  damaged_copies?: number;

  @ApiProperty({
    description: 'The ISBN of the book.',
    example: '9780743273565',
    maxLength: 13,
    required: false,
  })
  @IsString()
  @MaxLength(13)
  @IsOptional()
  isbn?: string;

  @ApiProperty({
    description: 'The year the book was published.',
    example: 1995,
    type: Number,
    required: false,
  })
  @IsNumber()
  @IsOptional()
  publication_year?: number;

  @ApiProperty({
    description: 'Public URL of the book cover image',
    example:
      'https://xyz.supabase.co/storage/v1/object/public/book-covers/uuid.jpg',
    maxLength: 255,
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  cover_image?: string;

  @ApiProperty({
    description: 'The UUID of the category',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    required: false,
  })
  @IsUUID()
  @IsOptional()
  category_id?: string | null;
}
