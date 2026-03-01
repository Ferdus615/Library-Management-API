import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { Fine } from 'src/fine/entities/fine.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Loan, Reservation, Fine])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
