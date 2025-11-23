import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { CreateLoanDto } from './dto/createLoanDto.dto';
import { ResponseLoanDto } from './dto/responseLoanDto.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateLoanDto } from './dto/updateLoanDto';
import { LoanStatus } from './enums/loanStatus.enum';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
  ) {}

  async createLoan(dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const user = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    if (!user) throw new NotFoundException(`User not `);

    const book = await this.bookRepository.findOne({
      where: { id: dto.book_id },
    });
    if (!book) throw new NotFoundException(`Book not found`);

    if (book.available_copies <= 0) {
      throw new BadRequestException(`Book is not available!`);
    }

    book.available_copies -= 1;
    await this.bookRepository.save(book);

    const loan = this.loanRepository.create({
      user,
      book,
      issue_date: dto.issue_date,
      due_date: dto.due_date,
    });

    const saveLoan = await this.loanRepository.save(loan);

    return plainToInstance(ResponseLoanDto, saveLoan);
  }

  async findAllLoan(): Promise<ResponseLoanDto[]> {
    const loan = await this.loanRepository.find();
    return plainToInstance(ResponseLoanDto, loan);
  }

  async findOneLoan(id: string): Promise<ResponseLoanDto> {
    const loan = await this.loanRepository.findOne({ where: { id } });
    if (!loan) throw new NotFoundException(`No such loan record found!`);

    return plainToInstance(ResponseLoanDto, loan);
  }

  async updateLoan(id: string, dto: UpdateLoanDto): Promise<ResponseLoanDto> {
    const loan = await this.loanRepository.findOne({ where: { id } });
    if (!loan) throw new NotFoundException(`No such loan record found!`);

    if (dto.return_date && loan.status !== LoanStatus.RETURNED) {
      loan.return_date = dto.return_date;
      loan.status = LoanStatus.RETURNED;

      const book = loan.book;
      book.available_copies += 1;
      await this.bookRepository.save(book);
    }

    if (dto.status) {
      loan.status = dto.status;
    }

    const updateLoan = await this.loanRepository.save(loan);
    return plainToInstance(ResponseLoanDto, updateLoan);
  }

  async deleteLoan(id: string): Promise<{ message: string }> {
    const loan = await this.loanRepository.findOne({ where: { id } });
    if (!loan) throw new NotFoundException(`No such loan record found!`);

    await this.loanRepository.remove(loan);
    return { message: `Loan record deleted successfully!` };
  }
}
