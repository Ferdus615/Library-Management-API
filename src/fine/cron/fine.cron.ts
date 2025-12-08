import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from 'src/loan/entities/loan.entity';
import { Repository } from 'typeorm';
import { Fine } from '../entities/fine.entity';

@Injectable()
export class FineCron {
  private readonly logger = new Logger(FineCron.name);
  private readonly FINE_RATE_PER_DAY = 10; // ₹10 per day

  constructor(
    @InjectRepository(Loan)
    private loanRepository: Repository<Loan>,

    @InjectRepository(Fine)
    private fineRepository: Repository<Fine>,
  ) {}

  // ------------------------------------------------------------------
  // Runs every 12 hours (at 12:00 AM and 12:00 PM)
  // CRON expression '0 0,12 * * *' means: minute 0, hour 0 AND 12, every day
  // ------------------------------------------------------------------
  @Cron('0 0,12 * * *')
  async generateAndAccrueOverdueFines() {
    this.logger.log('Running 12-hour fine accrual job...');

    const now = new Date();

    // 1. Find loans that are past their due date AND have NOT been returned yet
    const overdueLoans = await this.loanRepository
      .createQueryBuilder('loan')
      .leftJoinAndSelect('loan.user', 'user') // Eagerly load the user
      .where('loan.due_date < :now', { now: now.toISOString() }) // Past due date
      .andWhere('loan.return_date IS NULL') // Book is still out
      .getMany();

    this.logger.log(`Found ${overdueLoans.length} active overdue loans.`);

    for (const loan of overdueLoans) {
      // Calculate total overdue days based on the current time
      const due = new Date(loan.due_date);

      // (Current time - Due time) / milliseconds_per_day
      const overdueDays = Math.ceil(
        (now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24),
      );

      const fineAmount = overdueDays * this.FINE_RATE_PER_DAY;

      // 2. Check for existing fine
      let fine = await this.fineRepository.findOne({
        where: { loan: { id: loan.id } },
      });

      if (fine) {
        // 3. If fine exists (UPDATE): Update the amount to the new total
        fine.amount = fineAmount;
        this.logger.log(
          `Updated fine for Loan ${loan.id}. New amount: ${fineAmount}`,
        );
      } else {
        // 4. If fine does not exist (CREATE): Create the initial fine record
        fine = this.fineRepository.create({
          user: loan.user,
          loan,
          amount: fineAmount,
          paid: false,
        });
        this.logger.log(
          `Created initial fine for Loan ${loan.id}. Amount: ${fineAmount}`,
        );
      }

      await this.fineRepository.save(fine);
    }
    this.logger.log('12-hour fine accrual job finished.');
  }
}
