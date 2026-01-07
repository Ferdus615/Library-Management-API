import { Exclude, Expose, Type } from 'class-transformer';
import { LoanStatus } from '../enums/loanStatus.enum';
import { LoanBookResponseDto } from './loanBookResponseDto.dto';
import { LoanUserResponseDto } from './loanUserResponseDto.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseLoanDto {
  @ApiProperty({ example: 'uuid-string' })
  @Expose()
  id: string;

  @ApiProperty({ type: LoanUserResponseDto })
  @Expose()
  @Type(() => LoanUserResponseDto)
  user: LoanUserResponseDto;

  @ApiProperty({ type: LoanBookResponseDto })
  @Expose()
  @Type(() => LoanBookResponseDto)
  book: LoanBookResponseDto;

  @ApiProperty({ example: '2026-01-05' })
  @Expose()
  issue_date: Date;

  @ApiProperty({ example: '2026-01-19' })
  @Expose()
  due_date: Date;

  @ApiProperty({ example: null, nullable: true })
  @Expose()
  return_date: Date;

  @ApiProperty({ enum: LoanStatus, example: LoanStatus.ISSUED })
  @Expose()
  status: LoanStatus;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
