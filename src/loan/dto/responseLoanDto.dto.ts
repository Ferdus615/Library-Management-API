import { Exclude, Expose, Type, plainToInstance } from 'class-transformer';
import { LoanStatus } from '../enums/loanStatus.enum';
import { LoanBookResponseDto } from './loanBookResponseDto.dto';
import { LoanUserResponseDto } from './loanUserResponseDto.dto';
import { Loan } from '../entities/loan.entity';

export class ResponseLoanDto {
  constructor(loan: Loan) {
    this.id = loan.id;
    this.user = plainToInstance(LoanUserResponseDto, loan.user);
    this.book = plainToInstance(LoanBookResponseDto, loan.book);
    this.issue_date = loan.issue_date;
    this.due_date = loan.due_date;
    this.return_date = loan.return_date;
    this.status = loan.status;
    this.created_at = loan.created_at;
    this.updated_at = loan.updated_at;
  }

  @Expose()
  id: string;

  @Expose()
  @Type(() => LoanUserResponseDto)
  user: LoanUserResponseDto;

  @Expose()
  @Type(() => LoanBookResponseDto)
  book: LoanBookResponseDto;

  @Expose()
  issue_date: Date;

  @Expose()
  due_date: Date;

  @Expose()
  return_date: Date;

  @Expose()
  status: LoanStatus;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
