import { PartialType } from '@nestjs/swagger';
import { CreateLoanDto } from './createLoanDto.dto';
import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @IsOptional()
  @IsDateString()
  return_date?: Date;

  @IsOptional()
  @IsString()
  status?: 'issued' | 'returned' | 'overdue';

  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsOptional()
  @IsUUID()
  book_id?: string;
}
