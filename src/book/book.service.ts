import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async createBook(
    createBookDto: CreateBookDto | CreateBookDto[],
  ): Promise<ResponseBookDto | ResponseBookDto[]> {
    const arrBook = Array.isArray(createBookDto)
      ? createBookDto
      : [createBookDto];

    if (arrBook.length === 0) {
      throw new BadRequestException(`No book data provided!`);
    }

    const addBook = arrBook.map((book) =>
      this.bookRepository.create({
        ...book,
        available_copies: book.total_copies,
      }),
    );

    const saveBook = await this.bookRepository.save(addBook);

    const response = saveBook.map((book) => new ResponseBookDto(book));

    return Array.isArray(createBookDto) ? response : response[0];
  }

  async findAllBook(): Promise<ResponseBookDto[]> {
    const books = await this.bookRepository.find();
    return books.map((book) => new ResponseBookDto(book));
  }

  async findOneBook(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID-${id} not found`);

    return new ResponseBookDto(book);
  }

  async updateBook(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) {
      throw new NotFoundException(`Book with id:${id} not found!`);
    }

    const updateBook = this.bookRepository.merge(book, updateBookDto);

    if (updateBook.total_copies !== undefined) {
      const difference = updateBook.total_copies - book.total_copies;
      updateBook.available_copies =
        (updateBook.available_copies ?? book.available_copies ?? 0) +
        difference;

      if (updateBook.available_copies < 0) {
        updateBook.available_copies = 0;
      }
    }

    const saveBook = await this.bookRepository.save(updateBook);
    return new ResponseBookDto(saveBook);
  }

  async removeBook(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id:${id} not found!`);

    await this.bookRepository.remove(book);
    return { message: `Book with id:${id} has been removed successfully!` };
  }
}
