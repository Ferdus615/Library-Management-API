import { forwardRef, Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationCron } from './cron/expireReservation.cron';
import { NotificationModule } from 'src/notification/notification.module';
import { LoanModule } from 'src/loan/loan.module';
import { Loan } from 'src/loan/entities/loan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User, Book, Loan]),
    NotificationModule,
    forwardRef(() => LoanModule),
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationCron],
  exports: [ReservationService],
})
export class ReservationModule {}
