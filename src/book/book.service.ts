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
    const findBooks = await this.bookRepository.find();
    return findBooks.map((book) => plainToInstance(ResponseBookDto, book));
  }

  async findOneBook(id: string): Promise<ResponseBookDto> {
    const findBook = await this.bookRepository.findOne({ where: { id } });
    if (!findBook) throw new NotFoundException(`Book with ID-${id} not found`);

    return plainToInstance(ResponseBookDto, findBook);
  }

  async findBookLoans(id: string): Promise<ResponseLoanDto[]> {
    const findBook = await this.bookRepository.findOne({ where: { id } });
    if (!findBook) throw new NotFoundException(`Book with id:${id} not found!`);

    const loans = await this.loanRepository.find({
      where: { book: { id } },
      relations: ['user'],
      order: { issue_date: 'DESC' },
    });

    return plainToInstance(ResponseLoanDto, loans);
  }

  async updateBook(id: string, dto: UpdateBookDto): Promise<ResponseBookDto> {
    const findBook = await this.bookRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!findBook) throw new NotFoundException(`Book with id:${id} not found!`);

    // ─────────────────────────
    // Handle stock updates
    // ─────────────────────────
    if (dto.copies_added !== undefined) {
      const copiesAdded = Number(dto.copies_added);

      findBook.total_copies += copiesAdded;
      findBook.available_copies += copiesAdded;

      delete dto.copies_added;
    }

    if (dto.damaged_copies !== undefined) {
      const newDamagedCopies = Number(dto.damaged_copies);

      findBook.damaged_copies += newDamagedCopies;

      findBook.available_copies -= newDamagedCopies;

      if (findBook.available_copies < 0) {
        findBook.available_copies = 0;
      }

      delete dto.damaged_copies;
    }

    // ─────────────────────────
    // Handle category assignment
    // ─────────────────────────
    if (dto.category_id !== undefined) {
      if (dto.category_id === null) {
        findBook.category = null;
      } else {
        const category = await this.categoryRepository.findOne({
          where: { id: dto.category_id },
        });

        if (!category) throw new NotFoundException(`Category not found!`);

        findBook.category = category;
      }
    }

    Object.assign(findBook, dto); // refactor to use domain specific validation

    const savedBook = await this.bookRepository.save(findBook);

    return plainToInstance(ResponseBookDto, savedBook);
  }

  async removeBook(id: string) {
    const findBook = await this.bookRepository.findOne({ where: { id } });
    if (!findBook) throw new NotFoundException(`Book with id:${id} not found!`);

    await this.bookRepository.remove(findBook);
    return { message: `Book with id:${id} has been removed successfully!` };
  }
}
