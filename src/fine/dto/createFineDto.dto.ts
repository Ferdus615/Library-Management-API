import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateFineDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  loan_id: string;

  @IsInt()
  @Min(10)
  total_amount: number;
}
