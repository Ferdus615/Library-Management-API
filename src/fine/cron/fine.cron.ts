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

  @Cron('0 * * * *')
  async AutoGenerateFines() {
    this.logger.log('Running 12-hour fine accural job....');

    const now = new Date();

    const overdueLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.user', 'user')
      .where('loan.due_date < :now', { now: now.toISOString() })
      .andWhere('loan.return_date IS NULL')
      .getMany();

    this.logger.log(
      `${now.toISOString()}: Found ${overdueLoans.length} active overdue loans.`,
    );

    for (const loan of overdueLoans) {
      const due = new Date(loan.due_date);

      const overdueDays = Math.ceil(
        (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
      );

      const fineAmount = overdueDays * this.FINE_RATE_PER_DAY;

      let fine = await this.fineRepository.findOne({
        where: { loan: { id: loan.id } },
      });

      if (fine) {
        fine.total_amount = fineAmount;
        this.logger.log(
          `Update fine for loan ${loan.id}. New amount: ${fineAmount}`,
        );
      } else {
        fine = this.fineRepository.create({
          user: loan.user,
          loan,
          total_amount: fineAmount,
          paid: false,
        });

        this.logger.log(
          `Created initial fine for loan ${loan.id}. Amount: ${fineAmount}`,
        );
      }
      await this.fineRepository.save(fine);
    }
    this.logger.log(`12-hour fine accural job finished.`);
  }
}
