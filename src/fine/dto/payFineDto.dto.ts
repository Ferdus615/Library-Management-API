import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class PayFineDto {
  @ApiProperty({ example: true })
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @ApiProperty({ example: '2025-12-22T12:00:00Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  paid_at?: Date;
}
