import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { LessThan, Repository } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationStatus } from '../enum/reservation.enum';
import { ReservationService } from '../reservation.service';

@Injectable()
export class ReservationCron {
  private readonly logger = new Logger(ReservationCron.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly reservationService: ReservationService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async expireReservation(): Promise<void> {
    const now = new Date();

    const expiredReservations = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.READY,
        expires_at: LessThan(now),
      },
      relations: ['book'],
    });

    if (!expiredReservations.length) return;

    this.logger.log(`Expiring ${expiredReservations.length} reservation(s)`);

    for (const reservation of expiredReservations) {
      reservation.status = ReservationStatus.EXPIRED;
      await this.reservationRepository.save(reservation);

      await this.reservationService.promoteReservation(reservation.book);
    }
  }
}
