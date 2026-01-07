import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from './createCategoryDto.dto';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BulkCategoriesDto {
  @ApiProperty({
    description: 'An array of category objects to be created simultaneously',
    type: [CreateCategoryDto], // Tells Swagger this is an array of the other DTO
    minItems: 1,
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];
}
