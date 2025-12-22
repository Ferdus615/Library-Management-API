import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { LoanStatus } from 'src/loan/enums/loanStatus.enum';

export class FineLoanResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the loan record.',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The current status of the loan.',
    enum: LoanStatus,
    example: LoanStatus.OVERDUE,
  })
  @Expose()
  status: LoanStatus;

  @ApiProperty({
    description: 'The date the book was issued.',
    example: '2025-12-01T10:00:00Z',
  })
  @Expose()
  issue_date: Date;

  @ApiProperty({
    description: 'The date the book was supposed to be returned.',
    example: '2025-12-15T10:00:00Z',
  })
  @Expose()
  due_date: Date;

  @ApiProperty({
    description: 'The date the book was actually returned (if applicable).',
    example: '2025-12-20T14:30:00Z',
    nullable: true,
  })
  @Expose()
  return_date: Date;
}
