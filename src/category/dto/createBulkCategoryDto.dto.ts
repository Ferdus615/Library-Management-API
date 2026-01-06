import { ArrayMinSize, IsArray, ValidateNested } from 'class-validator';
import { CreateCategoryDto } from './createCategoryDto.dto';
import { Type } from 'class-transformer';

export class BulkCategoriesDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCategoryDto)
  categories: CreateCategoryDto[];
}
