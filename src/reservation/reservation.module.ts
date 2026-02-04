import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationCron } from './cron/expireReservation.cron';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, User, Book]),
    NotificationModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationCron],
  exports: [ReservationService],
})
export class ReservationModule {}
