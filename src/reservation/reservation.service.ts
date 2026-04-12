import {
  BadRequestException,
  Injectable,
  NotFoundException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/book/entities/book.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/responseReservationDto.dto';
import { ReservationStatus } from './enum/reservation.enum';
import { plainToInstance } from 'class-transformer';
import { NotificationType } from 'src/notification/enum/notificatio.enum';
import { NotificationService } from 'src/notification/notification.service';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { LoanService } from 'src/loan/loan.service';
import { ReservationQueryDto } from './dto/reservationQueryDto.dto';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly notificationService: NotificationService,
    @Inject(forwardRef(() => LoanService))
    private readonly loanService: LoanService,
  ) {}

  async createReservation(
    dto: CreateReservationDto,
  ): Promise<ResponseReservationDto> {
    const savedReservation =
      await this.reservationRepository.manager.transaction(async (manager) => {
        const userExist = await manager.exists(User, {
          where: { id: dto.user_id },
        });
        if (!userExist) throw new NotFoundException('User not found!');

        const bookExist = await manager.findOne(Book, {
          where: { id: dto.book_id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!bookExist) throw new NotFoundException('Book not found!');

        if (bookExist.available_copies > 0) {
          throw new BadRequestException(
            'Book is available! Please Borrow it instead.',
          );
        }

        const reservationExist = await manager.findOne(Reservation, {
          where: {
            user: { id: dto.user_id },
            book: { id: dto.book_id },
            status: In([ReservationStatus.PENDING, ReservationStatus.READY]),
          },
        });
        if (reservationExist) {
          throw new BadRequestException(
            'You already have an active reservation for this book!',
          );
        }

        const reservation = manager.create(Reservation, {
          user: { id: dto.user_id },
          book: { id: dto.book_id },
          status: ReservationStatus.PENDING,
        });

        return await manager.save(reservation);
      });

    try {
      await this.notificationService.notify(
        { id: dto.user_id },
        NotificationType.RESERVATION_CREATED,
        {
          bookTitle: savedReservation.book.title,
        },
      );
    } catch (error) {
      console.error('Notification failed:', error);
    }

    return plainToInstance(ResponseReservationDto, savedReservation, {
      excludeExtraneousValues: true,
    });
  }

  async receiveReservation(id: string): Promise<ResponseLoanDto> {
    const receiveReservation =
      await this.reservationRepository.manager.transaction(async (manager) => {
        const findReservation = await manager.findOne(Reservation, {
          where: { id },
          relations: ['user', 'book'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!findReservation)
          throw new NotFoundException('Reservation not found!');

        if (findReservation.status !== ReservationStatus.READY)
          throw new BadRequestException(
            'Reservation is either not ready or expired to be loaned!',
          );

        const createLoan = await this.loanService.createLoan({
          user_id: findReservation.user.id,
          book_id: findReservation.book.id,
        });

        findReservation.status = ReservationStatus.RECEIVED;
        await manager.save(findReservation);

        return createLoan;
      });

    return plainToInstance(ResponseLoanDto, receiveReservation, {
      excludeExtraneousValues: true,
    });
  }

  async cancelReservation(id: string): Promise<{ message: string }> {
    const cancelReservation =
      await this.reservationRepository.manager.transaction(async (manager) => {
        const findReservation = await manager.findOne(Reservation, {
          where: { id },
          relations: ['user', 'book'],
          lock: { mode: 'pessimistic_write' },
        });
        if (!findReservation)
          throw new NotFoundException('Reservation not found!');

        if (findReservation.status === ReservationStatus.RECEIVED)
          throw new BadRequestException(
            'Reservation has been received, please return it!',
          );

        if (
          findReservation.status === ReservationStatus.CANCELLED ||
          ReservationStatus.EXPIRED
        )
          throw new BadRequestException(
            'Reservation is already cancelled or expired!',
          );

        if (findReservation.status === ReservationStatus.READY) {
          const findBook = await manager.findOne(Book, {
            where: { id: findReservation.book.id },
            lock: { mode: 'pessimistic_write' },
          });
          if (!findBook) throw new NotFoundException('Book not found!');

          findBook.available_copies += 1;
          await manager.save(findBook);
        }

        findReservation.status = ReservationStatus.CANCELLED;
        await manager.save(findReservation);

        return findReservation;
      });

    try {
      await this.notificationService.notify(
        cancelReservation.user,
        NotificationType.RESERVATION_CANCELLED,
        {
          bookTitle: cancelReservation.book.title,
        },
      );
    } catch (error) {
      console.error('Notification failed', error);
    }

    return { message: 'Reservation cancelled successfully!' };
  }

  async findAllReservatios(query: ReservationQueryDto): Promise<{
    data: ResponseReservationDto[];
    total: number;
  }> {
    const { search, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.reservationRepository
      .createQueryBuilder('reservation')
      .leftJoinAndSelect('reservation.user', 'user')
      .leftJoinAndSelect('reservation.book', 'book');

    if (search) {
      queryBuilder.where(
        '(user.first_name ILIKE :search OR user.last_name ILIKE :search OR user.email ILIKE :search OR book.title ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [reservations, total] = await queryBuilder
      .orderBy('reservation.created_at', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data: reservations.map((reservation) =>
        plainToInstance(ResponseReservationDto, reservation, {
          excludeExtraneousValues: true,
        }),
      ),
      total,
    };
  }

  async findOneReservation(id: string): Promise<ResponseReservationDto> {
    const findReservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!findReservation) throw new NotFoundException(`Reservation not found!`);

    return plainToInstance(ResponseReservationDto, findReservation, {
      excludeExtraneousValues: true,
    });
  }

  async findReservationByBook(id: string): Promise<ResponseReservationDto[]> {
    const findReservation = await this.reservationRepository.find({
      where: { book: { id } },
      order: { created_at: 'ASC' },
    });
    if (findReservation.length === 0)
      throw new NotFoundException(`Reservation not found for this book!`);

    return findReservation.map((reservation) =>
      plainToInstance(ResponseReservationDto, reservation, {
        excludeExtraneousValues: true,
      }),
    );
  }

  async promoteReservation(id: string): Promise<void> {
    const reservationPromoted =
      await this.reservationRepository.manager.transaction(async (manager) => {
        const findBook = await manager.findOne(Book, {
          where: { id },
          lock: { mode: 'pessimistic_write' },
        });
        if (!findBook || findBook.available_copies === 0) return;

        const findReservation = await manager.findOne(Reservation, {
          where: {
            book: { id },
            status: ReservationStatus.PENDING,
          },
          relations: ['user', 'book'],
          order: { created_at: 'ASC' },
        });
        if (!findReservation) return;

        const result = await manager.update(
          Reservation,
          {
            where: { id: findReservation.id },
            status: ReservationStatus.PENDING,
          },
          {
            status: ReservationStatus.READY,
            ready_at: new Date(),
            expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          },
        );

        if (result.affected === 0) return;

        findBook.available_copies -= 1;
        await manager.save(findBook);

        return findReservation;
      });

    try {
      await this.notificationService.notify(
        { id: reservationPromoted?.user.id },
        NotificationType.RESERVATION_READY,
        {
          bookTitle: reservationPromoted?.book.title,
        },
      );
    } catch (error) {
      console.error('Notification failed', error);
    }
  }
}
