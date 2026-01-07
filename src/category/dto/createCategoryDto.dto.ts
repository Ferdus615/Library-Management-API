import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Unique name for the category',
    example: 'History',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  name: string;

  @ApiProperty({
    description: 'Detailed description of the category content',
    example: 'Books related to historical events and biographies.',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;
}
