import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import { LoanStatus } from '../enums/loanStatus.enum';

export class UpdateLoanDto {
  @ApiPropertyOptional({
    description: 'The timestamp when the book was actually returned',
    example: '2026-01-20T14:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  return_date?: Date;

  @ApiPropertyOptional({
    description: 'Update the current status of the loan',
    enum: LoanStatus,
  })
  @IsOptional()
  @IsEnum(LoanStatus)
  status?: LoanStatus;
}
