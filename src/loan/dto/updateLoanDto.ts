import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { LoanStatus } from '../enums/loanStatus.enum';

export class UpdateLoanDto {
  @IsOptional()
  @IsDateString()
  return_date?: Date;

  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;
}
