import { Expose, Type } from 'class-transformer';
import { LoanStatus } from '../enums/loanStatus.enum';
import { LoanBookResponseDto } from './loanBookResponseDto.dto';
import { LoanUserResponseDto } from './loanUserResponseDto.dto';

export class ResponseLoanDto {
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

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
