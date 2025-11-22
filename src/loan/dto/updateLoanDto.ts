import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { LoanStatus } from '../enums/loanStatus.enum';

export class UpdateLoanDto {
  @IsOptional()
  @IsDateString()
  return_date?: string;

  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;
}
