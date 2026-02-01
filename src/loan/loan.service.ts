import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Loan } from './entities/loan.entity';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { CreateLoanDto } from './dto/createLoanDto.dto';
import { ResponseLoanDto } from './dto/responseLoanDto.dto';
import { UpdateLoanDto } from './dto/updateLoanDto';
import { LoanStatus } from './enums/loanStatus.enum';
import { ReservationService } from 'src/reservation/reservation.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly reservationService: ReservationService,
  ) {}

  async createLoan(dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const findUser = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    if (!findUser) throw new NotFoundException(`User not found!`);

    const findBook = await this.bookRepository.findOne({
      where: { id: dto.book_id },
    });
    if (!findBook) throw new NotFoundException(`Book not found`);

    if (findBook.available_copies <= 0) {
      throw new BadRequestException(
        `Book is not available! Please rserve to get it when available.`,
      );
    }

    findBook.available_copies -= 1;
    await this.bookRepository.save(findBook);

    const loan = this.loanRepository.create({
      user: findUser,
      book: findBook,
      issue_date: new Date(),
      due_date: dto.due_date,
    });

    const savedLoan = await this.loanRepository.save(loan);

    const fullyLoadedLoan = await this.loanRepository.findOne({
      where: { id: savedLoan.id },
    });

    return plainToInstance(ResponseLoanDto, fullyLoadedLoan);
  }

  async findAllLoan(): Promise<ResponseLoanDto[]> {
    const findLoans = await this.loanRepository.find();
    return findLoans.map((loan) => plainToInstance(ResponseLoanDto, loan));
  }

  async findOneLoan(id: string): Promise<ResponseLoanDto> {
    const findLoan = await this.loanRepository.findOne({ where: { id } });
    if (!findLoan) throw new NotFoundException(`No such loan record found!`);

    return plainToInstance(ResponseLoanDto, findLoan);
  }

  async updateLoan(id: string, dto: UpdateLoanDto): Promise<ResponseLoanDto> {
    const findLoan = await this.loanRepository.findOne({
      where: { id },
      relations: ['book'],
    });
    if (!findLoan) {
      throw new NotFoundException(`No such loan record found!`);
    }

    // return book handle logic
    if (dto.return_date && findLoan.status !== LoanStatus.RETURNED) {
      findLoan.return_date = new Date();
      findLoan.status = LoanStatus.RETURNED;

      findLoan.book.available_copies += 1;

      await this.loanRepository.save(findLoan);
      await this.bookRepository.save(findLoan.book);

      // auto reservation promotion logic here
      await this.reservationService.promoteReservation(findLoan.book);
    }

    //controlled status update logic
    if (
      dto.status &&
      findLoan.status !== LoanStatus.RETURNED &&
      dto.status !== LoanStatus.RETURNED
    ) {
      findLoan.status = dto.status;
      await this.loanRepository.save(findLoan);
    }

    return plainToInstance(ResponseLoanDto, findLoan, {
      excludeExtraneousValues: true,
    });
  }

  async deleteLoan(id: string): Promise<{ message: string }> {
    const updatedLoan = await this.loanRepository.findOne({ where: { id } });
    if (!updatedLoan) throw new NotFoundException(`No such loan record found!`);

    await this.loanRepository.remove(updatedLoan);
    return { message: `Loan record deleted successfully!` };
  }
}
