import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/book/entities/book.entity';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/rseponseReservationDto.dto';
import { ReservationStatus } from './enum/reservation.enum';
import { plainToInstance } from 'class-transformer';
import { NotificationType } from 'src/notification/enum/notificatio.enum';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly notificationService: NotificationService,
  ) {}

  async createReservation(
    dto: CreateReservationDto,
  ): Promise<ResponseReservationDto> {
    const findUser = await this.userRepository.findOne({
      where: { id: dto.user_id },
    });
    if (!findUser)
      throw new NotFoundException(`User with id:${dto.user_id} not found!`);

    const findBook = await this.bookRepository.findOne({
      where: { id: dto.book_id },
    });
    if (!findBook)
      throw new NotFoundException(`Book with id:${dto.book_id} not found!`);

    if (findBook.available_copies > 0)
      throw new BadRequestException(
        `The book is availabel! Please loan the book.`,
      );

    const existing = await this.reservationRepository.findOne({
      where: {
        user: { id: dto.user_id },
        book: { id: dto.book_id },
        status: In([ReservationStatus.PENDING, ReservationStatus.READY]),
      },
    });

    if (existing) {
      throw new BadRequestException(
        `You have already requested a reservation for this book!`,
      );
    }

    const reservation = this.reservationRepository.create({
      user: findUser,
      book: findBook,
      status: ReservationStatus.PENDING,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    await this.notificationService.notify(
      findUser,
      NotificationType.RESERVATION_CREATED,
      {
        bookTitle: findBook.title,
      },
    );

    return plainToInstance(ResponseReservationDto, savedReservation);
  }

  async findAllReservatios(): Promise<ResponseReservationDto[]> {
    const findReservations = await this.reservationRepository.find();

    return findReservations.map((reservation) =>
      plainToInstance(ResponseReservationDto, reservation),
    );
  }

  async findOneReservation(id: string): Promise<ResponseReservationDto> {
    const findReservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!findReservation) throw new NotFoundException(`Reservation not found!`);

    return plainToInstance(ResponseReservationDto, findReservation);
  }

  async cancleReservation(id: string): Promise<ResponseReservationDto> {
    const findReservation = await this.reservationRepository.findOne({
      where: { id },
    });
    if (!findReservation) throw new NotFoundException(`Reservation not found!`);

    if (findReservation.status === ReservationStatus.PENDING) {
      findReservation.status = ReservationStatus.CANCELLED;
    }

    if (findReservation.status === ReservationStatus.READY) {
      // increase book count
      const book = findReservation.book;
      book.available_copies += 1;
      await this.bookRepository.save(book);

      findReservation.status = ReservationStatus.CANCELLED;
    }

    const cancleReservation =
      await this.reservationRepository.save(findReservation);

    await this.notificationService.notify(
      findReservation.user,
      NotificationType.RESERVATION_CANCELLED,
      {
        bookTitle: findReservation.book.title,
      },
    );

    return plainToInstance(ResponseReservationDto, cancleReservation);
  }

  async promoteReservation(book: Book): Promise<void> {
    if (book.available_copies <= 0) return;

    const findReservation = await this.reservationRepository.findOne({
      where: {
        book: { id: book.id },
        status: ReservationStatus.PENDING,
      },
      order: { created_at: 'ASC' },
    });

    if (!findReservation) return;

    const result = await this.reservationRepository.update(
      {
        id: findReservation.id,
        status: ReservationStatus.PENDING,
      },
      {
        status: ReservationStatus.READY,
        ready_at: new Date(),
        expires_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      },
    );

    // Another process already promoted it
    if (result.affected === 0) return;

    book.available_copies -= 1;
    await this.bookRepository.save(book);

    await this.notificationService.notify(
      findReservation.user,
      NotificationType.RESERVATION_READY,
      {
        bookTitle: findReservation.book.title,
      },
    );
  }
}
