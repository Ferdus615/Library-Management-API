import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Loan } from '../entities/loan.entity';
import { LoanStatus } from '../enums/loanStatus.enum';
import { NotificationType } from 'src/notification/enum/notificatio.enum';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class OverdueLoanCron {
  private readonly logger = new Logger(OverdueLoanCron.name);

  constructor(
    @InjectRepository(Loan) private readonly loanRespository: Repository<Loan>,
    private readonly notificationService: NotificationService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async AutoMarkOverdueLoan() {
    const today = new Date();

    const find_overdues = await this.loanRespository.find({
      where: { status: LoanStatus.ISSUED, due_date: LessThan(today) },
    });

    this.logger.log(
      `${today.toISOString()}: Found ${find_overdues.length} new overdue loan!`,
    );

    for (const loan of find_overdues) {
      loan.status = LoanStatus.OVERDUE;
      await this.loanRespository.save(loan);

      const date = loan.due_date.toISOString();

      this.logger.log(
        `Changed status of loan:${loan.id} to overdue. Due date was ${date}`,
      );

      await this.notificationService.notify(
        loan.user,
        NotificationType.LOAN_OVERDUE,
        {
          bookTitle: loan.book.title,
        },
      );
    }
  }
}
