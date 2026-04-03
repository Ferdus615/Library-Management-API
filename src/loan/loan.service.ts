import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
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
import { LoanQueryDto } from './dto/loanQueryDto.dto';

import { ReservationService } from 'src/reservation/reservation.service';
import { NotificationType } from 'src/notification/enum/notificatio.enum';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @Inject(forwardRef(() => ReservationService))
    private readonly reservationService: ReservationService,
    private readonly notificationService: NotificationService,
  ) {}

  async createLoan(dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const savedLoan = await this.loanRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const existingLoan = await transactionalEntityManager.exists(Loan, {
          where: {
            user: { id: dto.user_id },
            book: { id: dto.book_id },
            status: In([LoanStatus.ISSUED, LoanStatus.OVERDUE]),
          },
        });
        if (existingLoan)
          throw new BadRequestException(`User already has this book!`);

        const findBook = await transactionalEntityManager.findOne(Book, {
          where: { id: dto.book_id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!findBook) throw new NotFoundException(`Book not found`);

        if (findBook.available_copies <= 0) {
          throw new BadRequestException(
            `Book is not available! Please reserve to get it when available.`,
          );
        }

        await transactionalEntityManager.decrement(
          Book,
          { id: dto.book_id },
          'available_copies',
          1,
        );

        const loan = transactionalEntityManager.create(Loan, {
          user: { id: dto.user_id },
          book: findBook,
          issue_date: new Date(),
          due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        });

        return await transactionalEntityManager.save(loan);
      },
    );

    try {
      await this.notificationService.notify(
        savedLoan.user,
        NotificationType.LOAN_ISSUED,
        {
          bookTitle: savedLoan.book.title,
        },
      );
    } catch (error) {
      console.error('Failed to send notification', error);
    }

    return plainToInstance(ResponseLoanDto, savedLoan, {
      excludeExtraneousValues: true,
    });
  }

  async findAllLoan(query: LoanQueryDto): Promise<{
    data: ResponseLoanDto[];
    total: number;
  }> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.user', 'user')
      .leftJoinAndSelect('loan.book', 'book');

    if (search) {
      queryBuilder.where(
        '(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search OR book.title ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [loans, total] = await queryBuilder
      .orderBy('loan.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: loans.map((loan) =>
        plainToInstance(ResponseLoanDto, loan, {
          excludeExtraneousValues: true,
        }),
      ),
      total,
    };
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
      relations: ['book', 'user'],
    });
    if (!findLoan) {
      throw new NotFoundException(`No such loan record found!`);
    }

    // return book handle logic
    if (dto.return_date && findLoan.status !== LoanStatus.RETURNED) {
      await this.loanRepository.manager.transaction(
        async (transactionalEntityManager) => {
          const findBook = await transactionalEntityManager.findOne(Book, {
            where: { id: findLoan.book.id },
            lock: { mode: 'pessimistic_write' },
          });

          if (!findBook) {
            throw new NotFoundException(`Book not found for this loan!`);
          }

          findLoan.return_date = new Date();
          findLoan.status = LoanStatus.RETURNED;

          findBook.available_copies += 1;

          await transactionalEntityManager.save(findLoan);
          await transactionalEntityManager.save(findBook);

          // auto reservation promotion logic here
          await this.reservationService.promoteReservation(findBook);

          await this.notificationService.notify(
            findLoan.user,
            NotificationType.LOAN_RETURNED,
            {
              bookTitle: findBook.title,
            },
          );
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
