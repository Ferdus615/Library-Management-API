import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Patch,
} from '@nestjs/common';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Books } from './entities/book.entity';
import { ResponseBookDto } from './dto/responseBookDto.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Books)
    private readonly bookRepository: Repository<Books>,
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
    if (!book) throw new NotFoundException(`Book with id:${id} not found!`);

    if (updateBookDto.copies_added !== undefined) {
      const copiesAdded = Number(updateBookDto.copies_added);

      book.total_copies += copiesAdded;
      book.available_copies += copiesAdded;

      delete updateBookDto.copies_added;
    }

    if (updateBookDto.damaged_copies !== undefined) {
      const newDamagedCopies = Number(updateBookDto.damaged_copies);

      book.damaged_copies += newDamagedCopies;

      book.available_copies -= newDamagedCopies;

      if (book.available_copies < 0) {
        book.available_copies = 0;
      }

      delete updateBookDto.damaged_copies;
    }

    Object.assign(book, updateBookDto);

    const saveBook = await this.bookRepository.save(book);
    return new ResponseBookDto(saveBook);
  }

  async removeBook(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id:${id} not found!`);

    await this.bookRepository.remove(book);
    return { message: `Book with id:${id} has been removed successfully!` };
  }
}
