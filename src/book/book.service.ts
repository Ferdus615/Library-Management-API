import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { ResponseBookDto } from './dto/responseBookDto.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createBookDto: CreateBookDto): Promise<ResponseBookDto> {
    const { total_copies } = createBookDto;

    const newBook = this.bookRepository.create({
      ...createBookDto,
      available_copies: total_copies,
    });

    const savedBook = await this.bookRepository.save(newBook);

    return new ResponseBookDto(savedBook);
  }

  async findAll(): Promise<ResponseBookDto[]> {
    const books = await this.bookRepository.find();
    return books.map((book) => new ResponseBookDto(book));
  }

  async findOne(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID-${id} not found`);

    return new ResponseBookDto(book);
  }

  async update(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {}

  async remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
