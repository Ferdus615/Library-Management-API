import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/book/entities/book.entity';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/rseponseReservationDto.dto';
import { find } from 'rxjs';
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

    const reservation = this.reservationRepository.create({
      user: findUser,
      book: findBook,
      status: ReservationStatus.PENDING,
    });

    const savedReservation = await this.reservationRepository.save(reservation);

    return plainToInstance(ResponseReservationDto, savedReservation);
  }
}
