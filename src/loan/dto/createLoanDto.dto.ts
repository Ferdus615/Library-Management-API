import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateLoanDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789' })
  @IsUUID()
  @IsNotEmpty()
  user_id: string;

  @ApiProperty({ example: 'f9e8d7c6-b5a4-3210-fedc-ba9876543210' })
  @IsUUID()
  @IsNotEmpty()
  book_id: string;
}
