import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class PayFineDto {
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paid_at?: Date;
}
