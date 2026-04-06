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
import { Fine } from 'src/fine/entities/fine.entity';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    @InjectRepository(Fine) private readonly fineRepository: Repository<Fine>,
    @Inject(forwardRef(() => ReservationService))
    private readonly reservationService: ReservationService,
    private readonly notificationService: NotificationService,
  ) {}

  async createLoan(dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const savedLoan = await this.loanRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const hasExistingLoan = await transactionalEntityManager.exists(Loan, {
          where: {
            user: { id: dto.user_id },
            book: { id: dto.book_id },
            status: In([LoanStatus.ISSUED, LoanStatus.OVERDUE]),
          },
        });
        if (hasExistingLoan)
          throw new BadRequestException(
            `User already have this book! Please return the book before taking a new loan.`,
          );

        const activeLoanCount = await transactionalEntityManager.count(Loan, {
          where: {
            user: { id: dto.user_id },
            status: In([LoanStatus.ISSUED, LoanStatus.OVERDUE]),
          },
        });
        if (activeLoanCount >= 2)
          throw new BadRequestException(
            'You have multiple running loans! Please return them first.',
          );

        const hasUnpaidFine = await transactionalEntityManager.exists(Fine, {
          where: {
            user: { id: dto.user_id },
            paid: false,
          },
        });
        if (hasUnpaidFine)
          throw new BadRequestException(
            'You have unpaid fines! Please pay them before taking a new loan.',
          );

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

        findBook.available_copies -= 1;
        await transactionalEntityManager.save(findBook);

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
    let isReturnProcessed = false;
    const updatedLoan = await this.loanRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const findLoan = await transactionalEntityManager.findOne(Loan, {
          where: { id },
          relations: ['book', 'user'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!findLoan) {
          throw new NotFoundException(`No such loan record found!`);
        }

        // handle return logic
        if (dto.return_date && findLoan.status !== LoanStatus.RETURNED) {
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
          isReturnProcessed = true;
        }

        // controlled status update logic
        if (
          dto.status &&
          findLoan.status !== LoanStatus.RETURNED &&
          dto.status !== LoanStatus.RETURNED
        ) {
          findLoan.status = dto.status;
          await transactionalEntityManager.save(findLoan);
        }

        return findLoan;
      },
    );

    // auto reservation promotion logic here
    if (isReturnProcessed) {
      await this.reservationService.promoteReservation(updatedLoan.book);

      try {
        await this.notificationService.notify(
          updatedLoan.user,
          NotificationType.LOAN_RETURNED,
          {
            bookTitle: updatedLoan.book.title,
          },
        );
      } catch (error) {
        console.error('Failed to send update notification', error);
      }
    }

    // controlled status update notification
    if (
      dto.status &&
      updatedLoan.status !== LoanStatus.RETURNED &&
      dto.status !== LoanStatus.RETURNED
    ) {
      const notificationMap: Record<string, NotificationType> = {
        [LoanStatus.ISSUED]: NotificationType.LOAN_ISSUED,
        [LoanStatus.OVERDUE]: NotificationType.LOAN_OVERDUE,
      };

      const notificationType = notificationMap[dto.status];

      if (notificationType) {
        await this.notificationService.notify(
          updatedLoan.user,
          notificationType,
          {
            bookTitle: updatedLoan.book.title,
          },
        );
      }
    }

    return plainToInstance(ResponseLoanDto, updatedLoan, {
      excludeExtraneousValues: true,
    });
  }

  async deleteLoan(id: string): Promise<{ message: string }> {
    await this.loanRepository.manager.transaction(
      async (transactionalEntityManager) => {
        const findLoan = await transactionalEntityManager.findOne(Loan, {
          where: { id },
          relations: ['book'],
          lock: { mode: 'pessimistic_write' },
        });

        if (!findLoan) {
          throw new NotFoundException(`No such loan record found!`);
        }

        // If the loan is not returned, restore the book copy
        if (findLoan.status !== LoanStatus.RETURNED) {
          const findBook = await transactionalEntityManager.findOne(Book, {
            where: { id: findLoan.book.id },
            lock: { mode: 'pessimistic_write' },
          });

          if (findBook) {
            findBook.available_copies += 1;
            await transactionalEntityManager.save(findBook);
          }
        }

        await transactionalEntityManager.remove(findLoan);
      },
    );

    return { message: `Loan record deleted successfully!` };
  }
}
