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
    const findBooks = await this.bookRepository.find();
    return findBooks.map((book) => new ResponseBookDto(book));
  }

  async findOneBook(id: string): Promise<ResponseBookDto> {
    const findBook = await this.bookRepository.findOne({ where: { id } });
    if (!findBook) throw new NotFoundException(`Book with ID-${id} not found`);

    return new ResponseBookDto(findBook);
  }

  async updateBook(
    id: string,
    updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    const findBook = await this.bookRepository.findOne({ where: { id } });
    if (!findBook) throw new NotFoundException(`Book with id:${id} not found!`);

    if (updateBookDto.copies_added !== undefined) {
      const copiesAdded = Number(updateBookDto.copies_added);

      findBook.total_copies += copiesAdded;
      findBook.available_copies += copiesAdded;

      delete updateBookDto.copies_added;
    }

    if (updateBookDto.damaged_copies !== undefined) {
      const newDamagedCopies = Number(updateBookDto.damaged_copies);

      findBook.damaged_copies += newDamagedCopies;

      findBook.available_copies -= newDamagedCopies;

      if (findBook.available_copies < 0) {
        findBook.available_copies = 0;
      }

      delete updateBookDto.damaged_copies;
    }

    Object.assign(findBook, updateBookDto);

    const savedBook = await this.bookRepository.save(findBook);
    return new ResponseBookDto(savedBook);
  }

  async removeBook(id: string) {
    const findBook = await this.bookRepository.findOne({ where: { id } });
    if (!findBook) throw new NotFoundException(`Book with id:${id} not found!`);

    await this.bookRepository.remove(findBook);
    return { message: `Book with id:${id} has been removed successfully!` };
  }
}
