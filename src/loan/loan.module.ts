import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { Loan } from './entities/loan.entity';
import { User } from 'src/user/entities/user.entity';
import { Book } from 'src/book/entities/book.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OverdueLoanCron } from './cron/overdue.cron';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, User, Book])],
  controllers: [LoanController],
  providers: [LoanService, OverdueLoanCron],
})
export class LoanModule {}
