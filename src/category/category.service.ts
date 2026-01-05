import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCategoryDto } from './dto/createCategoryDto.dto';
import { UpdateCategoryDto } from './dto/updateCategoryDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { ResponseCategoryDto } from './dto/responseCategoryDto.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(dto: CreateCategoryDto): Promise<ResponseCategoryDto> {
    const exist = await this.categoryRepository.findOne({
      where: { name: dto.name },
    });
    if (exist) throw new BadRequestException(`Category already exists!`);

    const category = this.categoryRepository.create(dto);

    const saved = await this.categoryRepository.save(category);

    return plainToInstance(ResponseCategoryDto, saved);
  }

  async findAll(): Promise<ResponseCategoryDto[]> {
    const findCategories = await this.categoryRepository.find();

    return findCategories.map((category) =>
      plainToInstance(ResponseCategoryDto, category),
    );
  }

  async findOne(id: string): Promise<ResponseCategoryDto> {
    const findCategory = await this.categoryRepository.findOne({
      where: { id },
    });
    if (!findCategory) throw new NotFoundException(`Category not found!`);

    return plainToInstance(ResponseCategoryDto, findCategory);
  }

  // async update(
  //   id: string,
  //   dto: UpdateCategoryDto,
  // ): Promise<ResponseCategoryDto> {
  //   const category = await this.categoryRepository.findOne({ where: { id } });
  //   if (!category) throw new NotFoundException(`Category not found!`);
  // }

  async remove(id: string): Promise<{ message: string }> {
    const exist = await this.categoryRepository.findOne({ where: { id } });
    if (!exist) {
      throw new NotFoundException(`Category doesn't exist!`);
    }

    await this.categoryRepository.remove(exist);

    return { message: `This action removes a #${id} category` };
  }
}
