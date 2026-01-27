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

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
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

    findReservation.status = ReservationStatus.CANCELLED;
    const cancleReservation =
      await this.reservationRepository.save(findReservation);

    return plainToInstance(ResponseReservationDto, cancleReservation);
  }

  async promoteReservation(book: Book): Promise<void> {
    if (book.available_copies <= 0) return;

    const reservation = await this.reservationRepository.findOne({
      where: {
        book: { id: book.id },
        status: ReservationStatus.PENDING,
      },
      order: { created_at: 'ASC' },
    });

    if (!reservation) return;

    reservation.status = ReservationStatus.READY;
    reservation.ready_at = new Date();
    reservation.expires_at = new Date(Date() + 3 * 24 * 60 * 60 * 1000);

    book.available_copies -= 1;

    await this.reservationRepository.save(reservation);
    await this.bookRepository.save(book);
  }
}
