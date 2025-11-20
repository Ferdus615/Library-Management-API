import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @IsUUID()
  @IsNotEmpty()
  book_id: string;

  @IsDateString()
  @IsNotEmpty()
  issue_date: Date;

  @IsDateString()
  @IsNotEmpty()
  due_date: Date;
}
