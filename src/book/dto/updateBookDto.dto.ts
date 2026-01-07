import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, MaxLength } from 'class-validator';
export class UpdateBookDto {
  @ApiProperty({
    description: 'The new title of the book.',
    example: 'Pride and Prejudice (Annotated Edition)',
    maxLength: 150,
    required: false, // Indicates the field is optional for the update
  })
  @IsString()
  @MaxLength(150)
  title?: string;

  @ApiProperty({
    description: 'The new author of the book.',
    example: 'Jane Austen and modern scholar',
    maxLength: 100,
    required: false, // Indicates the field is optional
  })
  @IsString()
  @MaxLength(100)
  author?: string;

  @ApiProperty({
    description: 'The number of new copies added to the total stock.',
    example: 5,
    type: Number,
    required: false, // Indicates the field is optional
  })
  @IsNumber()
  copies_added?: number;

  @ApiProperty({
    description:
      'The number of damaged copies to subtract from the total stock.',
    example: 2,
    type: Number,
    required: false, // Indicates the field is optional
  })
  @IsNumber()
  damaged_copies?: number;

  @ApiProperty({
    description: 'The UUID of the category',
    example: 'efb2c3d4-e5f6-7890-abcd-ef0123456789',
    required: false,
  })
  category_id?: string;
}
