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
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { ReservationStatus } from 'src/reservation/enum/reservation.enum';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
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
    const findLoan = await this.loanRepository.findOne({ where: { id } });
    if (!findLoan) throw new NotFoundException(`No such loan record found!`);

    if (dto.return_date && findLoan.status !== LoanStatus.RETURNED) {
      findLoan.return_date = dto.return_date;
      findLoan.status = LoanStatus.RETURNED;

      const book = findLoan.book;

      const nextReservation = await this.reservationRepository.findOne({
        where: {
          book: { id: book.id },
          status: ReservationStatus.PENDING,
        },
        order: { created_at: 'ASC' },
      });

      if (nextReservation) {
        nextReservation.status = ReservationStatus.READY;
        nextReservation.expires_at = new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000,
        );

        await this.reservationRepository.save(nextReservation);
      } else {
        book.available_copies += 1;
        await this.bookRepository.save(book);
      }
    }

    if (dto.status && dto.status !== LoanStatus.RETURNED) {
      if (findLoan.status !== LoanStatus.RETURNED) {
        findLoan.status = dto.status;
      }
    }

    const updatedLoan = await this.loanRepository.save(findLoan);
    return plainToInstance(ResponseLoanDto, updatedLoan);
  }

  async deleteLoan(id: string): Promise<{ message: string }> {
    const updatedLoan = await this.loanRepository.findOne({ where: { id } });
    if (!updatedLoan) throw new NotFoundException(`No such loan record found!`);

    await this.loanRepository.remove(updatedLoan);
    return { message: `Loan record deleted successfully!` };
  }
}
