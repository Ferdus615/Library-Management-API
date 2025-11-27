import { Expose, Type } from 'class-transformer';
import { FineUserResponseDto } from './fineUserResponseDto.dto';
import { FineLoanResponseDto } from './fineLoanResponseDto.dto';

export class ResponseFineDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => FineUserResponseDto)
  user: FineUserResponseDto;

  @Expose()
  @Type(() => FineLoanResponseDto)
  loan: FineLoanResponseDto;

  @Expose()
  amount: number;

  @Expose()
  paid: boolean;

  @Expose()
  paid_at: Date;
}
