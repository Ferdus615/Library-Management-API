import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  UsePipes,
  ValidationPipe,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/createCategoryDto.dto';
import { UpdateCategoryDto } from './dto/updateCategoryDto.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseCategoryDto } from './dto/responseCategoryDto.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BulkCategoriesDto } from './dto/createBulkCategoryDto.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MemberStatus } from 'src/user/enum/member.enum';

@ApiTags('Categories')
@ApiBearerAuth()
@Roles(MemberStatus.ADMIN)
@UseGuards(RolesGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new book category',
    description:
      'Adds a new category (e.g., Biography, Tech). Category names must be unique.',
  })
  @ApiResponse({
    status: 201,
    description: 'Category created.',
    type: ResponseCategoryDto,
  })
  @ApiResponse({ status: 400, description: 'Category name already exists.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async create(@Body() dto: CreateCategoryDto): Promise<ResponseCategoryDto> {
    const category = await this.categoryService.createCategory(dto);
    return plainToInstance(ResponseCategoryDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Post('/bulk')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Bulk create categories',
    description:
      'Creates multiple categories in a single transaction. Validates against duplicates in the request and existing entries in the database.',
  })
  @ApiResponse({
    status: 201,
    description: 'All categories created successfully.',
    type: [ResponseCategoryDto],
  })
  @ApiResponse({
    status: 400,
    description:
      'Validation failed: Duplicates found or category already exists.',
  })
  async createCategories(
    @Body() dto: BulkCategoriesDto,
  ): Promise<ResponseCategoryDto[]> {
    const categories = await this.categoryService.createCategories(dto);
    return plainToInstance(ResponseCategoryDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  @ApiOperation({ summary: 'List all categories' })
  @ApiResponse({ status: 200, type: [ResponseCategoryDto] })
  async findAll(): Promise<ResponseCategoryDto[]> {
    const categories = await this.categoryService.findAllCategory();
    return plainToInstance(ResponseCategoryDto, categories, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get category by ID' })
  @ApiParam({ name: 'id', format: 'uuid', example: 'e123-f456-7890' })
  @ApiResponse({ status: 200, type: ResponseCategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async findOne(@Param('id') id: string): Promise<ResponseCategoryDto> {
    const category = await this.categoryService.findOneCategory(id);
    return plainToInstance(ResponseCategoryDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a category' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseCategoryDto })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    const category = await this.categoryService.updateCategory(id, dto);
    return plainToInstance(ResponseCategoryDto, category, {
      excludeExtraneousValues: true,
    });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Category deleted.' })
  @ApiResponse({ status: 404, description: 'Category not found.' })
  async remove(@Param('id') id: string): Promise<{ message: string }> {
    return await this.categoryService.remove(id);
  }
}
