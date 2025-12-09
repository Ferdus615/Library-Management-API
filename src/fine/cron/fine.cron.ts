import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/loan/entities/loan.entity';
import { Repository } from 'typeorm';
import { Fine } from '../entities/fine.entity';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class FineCron {
  private readonly logger = new Logger(FineCron.name);
  private readonly FINE_RATE_PER_DAY = 10; // BDT 10 per day

  constructor(
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Fine) private readonly fineRepository: Repository<Fine>,
  ) {}

  @Cron('0 0,12 * * *')
  async AutoGenerateFines() {
    this.logger.log('Running 12-hour fine accural job....');

    const now = new Date();

    const overdueLoans = await this.loanRepository.createQueryBuilder('loan')
  }
}
