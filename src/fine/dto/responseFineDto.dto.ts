import { Expose, Type } from 'class-transformer';
import { FineUserResponseDto } from './fineUserResponseDto.dto';
import { FineLoanResponseDto } from './fineLoanResponseDto.dto';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseFineDto {
  @ApiProperty({
    description: 'The unique identifier of the fine.',
    example: '88496a1f-217a-499a-902f-4e88b09a23db',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({ type: () => FineUserResponseDto })
  @Expose()
  @Type(() => FineUserResponseDto)
  user: FineUserResponseDto;

  @ApiProperty({ type: () => FineLoanResponseDto })
  @Expose()
  @Type(() => FineLoanResponseDto)
  loan: FineLoanResponseDto;

  @ApiProperty({ description: 'The total fine amount.', example: 50.0 })
  @Expose()
  total_amount: number;

  @ApiProperty({ description: 'Payment status.', example: false })
  @Expose()
  paid: boolean;

  @ApiProperty({
    description: 'The date and time the fine was paid.',
    example: '2025-12-22T17:49:33Z',
    nullable: true,
  })
  @Expose()
  paid_at: Date;
}
