import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/loan/entities/loan.entity';
import { Repository } from 'typeorm';
import { Fine } from '../entities/fine.entity';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LoanStatus } from 'src/loan/enums/loanStatus.enum';

@Injectable()
export class FineCron {
  private readonly logger = new Logger(FineCron.name);

  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,

    @InjectRepository(Fine) private readonly fineRepository: Repository<Fine>,
  ) {}

  @Cron(CronExpression.EVERY_12_HOURS)
  async generateOverdueFines() {
    this.logger.log('Running regular 12 hours fine generation job...');

    const loans = await this.loanRepository.find({
      where: { status: LoanStatus.OVERDUE },
      relations: ['user'],
    });

    for (const loan of loans) if (!loan.return_date) continue;

    const 
  }
}
