import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Loan } from './entities/loan.entity';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { CreateLoanDto } from './dto/createLoanDto.dto';
import { ResponseLoanDto } from './dto/responseLoanDto.dto';
import { UpdateLoanDto } from './dto/updateLoanDto';
import { LoanStatus } from './enums/loanStatus.enum';
import { ReservationService } from 'src/reservation/reservation.service';
import { NotificationType } from 'src/notification/enum/notificatio.enum';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly reservationService: ReservationService,
    private readonly notificationService: NotificationService,
  ) {}

  async createLoan(dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const existingLoan = await this.loanRepository.findOne({
      where: {
        user: { id: dto.user_id },
        book: { id: dto.book_id },
        status: In([LoanStatus.ISSUED, LoanStatus.OVERDUE]),
      },
    });
    if (existingLoan)
      throw new BadRequestException(`User already has this book!`);

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

    await this.notificationService.notify(
      findUser,
      NotificationType.LOAN_ISSUED,
      {
        bootTitle: findBook.title,
      },
    );

    const fullyLoadedLoan = await this.loanRepository.findOne({
      where: { id: savedLoan.id },
    });

    return plainToInstance(ResponseLoanDto, fullyLoadedLoan, {
      excludeExtraneousValues: true,
    });
  }

  async findAllLoan(): Promise<ResponseLoanDto[]> {
    const findLoans = await this.loanRepository.find();
    return findLoans.map((loan) =>
      plainToInstance(ResponseLoanDto, loan, { excludeExtraneousValues: true }),
    );
  }

  async findOneLoan(id: string): Promise<ResponseLoanDto> {
    const findLoan = await this.loanRepository.findOne({ where: { id } });
    if (!findLoan) throw new NotFoundException(`No such loan record found!`);

    return plainToInstance(ResponseLoanDto, findLoan, {
      excludeExtraneousValues: true,
    });
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

      await this.notificationService.notify(
        findLoan.user,
        NotificationType.LOAN_RETURNED,
        {
          bookTitle: findLoan.book.title,
        },
      );
    }

    //controlled status update logic
    if (
      dto.status &&
      findLoan.status !== LoanStatus.RETURNED &&
      dto.status !== LoanStatus.RETURNED
    ) {
      findLoan.status = dto.status;
      await this.loanRepository.save(findLoan);

      await this.notificationService.notify(
        findLoan.user,
        NotificationType[`LOAN_${dto.status}`],
        {
          bookTitle: findLoan.book.title,
        },
      );
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
