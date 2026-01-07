import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategoryDto.dto';
import { UpdateCategoryDto } from './dto/updateCategoryDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponseCategoryDto } from './dto/responseCategoryDto.dto';
import { BulkCategoriesDto } from './dto/createBulkCategoryDto.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategory(dto: CreateCategoryDto): Promise<ResponseCategoryDto> {
    const exist = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (exist) throw new BadRequestException(`Category already exists!`);

    const category = this.categoryRepository.create(dto);

    const saved = await this.categoryRepository.save(category);
    return plainToInstance(ResponseCategoryDto, saved);
  }

  async createCategories(
    dto: BulkCategoriesDto,
  ): Promise<ResponseCategoryDto[]> {
    const names = dto.categories.map((category) =>
      category.name.trim().toLowerCase(),
    );

    const duplicateNames = names.filter(
      (name, index) => names.indexOf(name) !== index,
    );
    if (duplicateNames.length) {
      throw new BadRequestException(
        `Duplicate categories in data: ${[...new Set(duplicateNames)].join(', ')}`,
      );
    }

    const exist = await this.categoryRepository.find({
      where: { name: In(names) },
    });
    if (exist.length) {
      throw new BadRequestException(
        `Category alredy exists: ${exist.map((cat) => cat.name).join(', ')}`,
      );
    }

    const categories = this.categoryRepository.create(
      dto.categories.map((category) => ({
        ...category,
        name: category.name.trim(),
      })),
    );
    const savedCategories = await this.categoryRepository.save(categories);

    return plainToInstance(ResponseCategoryDto, savedCategories);
  }

  async findAllCategory(): Promise<ResponseCategoryDto[]> {
    const findCategories = await this.categoryRepository.find();

    return findCategories.map((category) =>
      plainToInstance(ResponseCategoryDto, category),
    );
  }

  async findOneCategory(id: string): Promise<ResponseCategoryDto> {
    const findCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!findCategory) throw new NotFoundException(`Category not found!`);

    return plainToInstance(ResponseCategoryDto, findCategory);
  }

  async updateCategory(
    id: string,
    dto: UpdateCategoryDto,
  ): Promise<ResponseCategoryDto> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Category not found!`);

    if (dto.name !== undefined) {
      category.name = dto.name;
    }

    if (dto.description !== undefined) {
      category.description = dto.description;
    }

    // const category = this.categoryRepository.merge(category, dto);

    const saved = await this.categoryRepository.save(category);
    return plainToInstance(ResponseCategoryDto, saved);
  }

  async remove(id: string): Promise<{ message: string }> {
    const exist = await this.categoryRepository.findOne({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`Category doesn't exist!`);
    }

    await this.categoryRepository.remove(exist);

    return { message: `This action removes a #${id} category` };
  }
}
