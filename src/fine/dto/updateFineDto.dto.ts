import { IsBoolean, IsDate, IsOptional } from 'class-validator';

export class UpdateFineDto {
  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsDate()
  paid_at?: Date;
}
