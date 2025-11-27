import { Expose } from 'class-transformer';
import { LoanStatus } from 'src/loan/enums/loanStatus.enum';

export class FineLoanResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: LoanStatus;

  @Expose()
  issue_date: Date;

  @Expose()
  due_date: Date;

  @Expose()
  return_date: Date;
}
