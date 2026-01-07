import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { ResponseBookDto } from './dto/responseBookDto.dto';
import { Loan } from 'src/loan/entities/loan.entity';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { Category } from 'src/category/entities/category.entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
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

    const savedBook = await this.bookRepository.save(addBook);

    const response = savedBook.map((book) =>
      plainToInstance(ResponseBookDto, book),
    );

    return Array.isArray(createBookDto) ? response : response[0];
  }

  async findAllBook(): Promise<ResponseBookDto[]> {
    const books = await this.bookRepository.find();
    return books.map((book) => plainToInstance(ResponseBookDto, book));
  }

  async findOneBook(id: string): Promise<ResponseBookDto> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with ID-${id} not found`);

    return plainToInstance(ResponseBookDto, book);
  }

  async bookLoans(id: string): Promise<ResponseLoanDto[]> {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id:${id} not found!`);

    const loans = await this.loanRepository.find({
      where: { book: { id } },
      relations: ['user'],
      order: { issue_date: 'DESC' },
    });

    return plainToInstance(ResponseLoanDto, loans);
  }

  async updateBook(id: string, dto: UpdateBookDto): Promise<ResponseBookDto> {
    const book = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!book) throw new NotFoundException(`Book with id:${id} not found!`);

    // ─────────────────────────
    // Handle stock updates
    // ─────────────────────────
    if (dto.copies_added !== undefined) {
      const copiesAdded = Number(dto.copies_added);

      book.total_copies += copiesAdded;
      book.available_copies += copiesAdded;

      delete dto.copies_added;
    }

    if (dto.damaged_copies !== undefined) {
      const newDamagedCopies = Number(dto.damaged_copies);

      book.damaged_copies += newDamagedCopies;

      book.available_copies -= newDamagedCopies;

      if (book.available_copies < 0) {
        book.available_copies = 0;
      }

      delete dto.damaged_copies;
    }

    // ─────────────────────────
    // Handle category assignment
    // ─────────────────────────
    if (dto.category_id !== undefined) {
      if (dto.category_id === null) {
        book.category = null;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: dto.category_id },
        });

        if (!category) throw new NotFoundException(`Category not found!`);

        book.category = category;
      }
    }

    // ─────────────────────────
    // Handle scalar updates
    // ─────────────────────────

    // Object.assign(book, dto); // refactor to use domain specific validation
    if (dto.title !== undefined) {
      book.title = dto.title;
    }

    if (dto.author !== undefined) {
      book.author = dto.author;
    }

    const savedBook = await this.bookRepository.save(book);
    return plainToInstance(ResponseBookDto, savedBook);
  }

  async removeBook(id: string) {
    const book = await this.bookRepository.findOne({ where: { id } });
    if (!book) throw new NotFoundException(`Book with id:${id} not found!`);

    await this.bookRepository.remove(book);
    return { message: `Book with id:${id} has been removed successfully!` };
  }
}
