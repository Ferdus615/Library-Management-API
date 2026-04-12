import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { LessThan, Repository } from 'typeorm';
import { Book } from 'src/book/entities/book.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ReservationStatus } from '../enum/reservation.enum';
import { ReservationService } from '../reservation.service';
import { find } from 'rxjs';

@Injectable()
export class ReservationCron {
  private readonly logger = new Logger(ReservationCron.name);
  notificationService: any;

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    @InjectRepository(Book) private readonly bookRepository: Repository<Book>,
    private readonly reservationService: ReservationService,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async expireReservation(): Promise<void> {
    const now = new Date();

    const expiredReservation = await this.reservationRepository.find({
      where: {
        status: ReservationStatus.READY,
        expires_at: LessThan(now),
      },
      select: ['id'],
    });
    if (expiredReservation.length === 0) return;

    this.logger.log(`Expiring ${expiredReservation.length} reservations...`);

    for (const { id } of expiredReservation) {
      const expiredBookId =
        await this.reservationRepository.manager.transaction(
          async (manager) => {
            const findReservation = await manager.findOne(Reservation, {
              where: { id },
              relations: ['user', 'book'],
              lock: { mode: 'pessimistic_write' },
            });
            if (!findReservation) return;

            if (
              findReservation.status !== ReservationStatus.READY ||
              findReservation.expires_at > now
            )
              return;

            const updateBook = await manager.findOne(Book, {
              where: { id: findReservation.book.id },
              lock: { mode: 'pessimistic_write' },
            });
            if (!updateBook) return;

            findReservation.status = ReservationStatus.EXPIRED;
            await manager.save(findReservation);

            updateBook.available_copies += 1;
            await manager.save(updateBook);

            return updateBook.id;
          },
        );

      if (expiredBookId) {
        await this.reservationService.promoteReservation(expiredBookId);
      }
    }
  }
}
