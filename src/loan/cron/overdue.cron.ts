import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Loan } from '../entities/loan.entity';
import { LoanStatus } from '../enums/loanStatus.enum';

@Injectable()
export class OverdueLoanCron {
  private readonly logger = new Logger(OverdueLoanCron.name);

  constructor(
    @InjectRepository(Loan) private readonly loanRespository: Repository<Loan>,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  markOverdueLoan() {
    const today = new Date();

    const find_overdues = await this.loanRespository.find({
      where: { status: LoanStatus.ISSUED, due_date: LessThan(today) },
    });
  }
}
