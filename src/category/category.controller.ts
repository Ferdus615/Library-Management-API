import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategoryDto.dto';
import { UpdateCategoryDto } from './dto/updateCategoryDto.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseCategoryDto } from './dto/responseCategoryDto.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    const category = await this.categoryService.create(createCategoryDto);
    return plainToInstance(ResponseCategoryDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAll(): Promise<ResponseCategoryDto[]> {
    const categories = await this.categoryService.findAll();
    return plainToInstance(ResponseCategoryDto, categories);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseCategoryDto> {
    const category = await this.categoryService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateCategoryDto: UpdateCategoryDto,
  // ) {
  //   return this.categoryService.update(+id, updateCategoryDto);
  // }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.categoryService.remove(id);
  }
}
