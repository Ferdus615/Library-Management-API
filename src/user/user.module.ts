import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Loan } from 'src/loan/entities/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Loan, Reservation])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
