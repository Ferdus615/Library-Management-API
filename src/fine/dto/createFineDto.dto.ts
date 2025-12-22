import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsUUID, Min } from 'class-validator';

export class CreateFineDto {
  @ApiProperty({ example: '88469a1f-216a-499a-902f-4e66b09a23db' })
  @IsUUID()
  user_id: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  loan_id: string;

  @ApiProperty({ example: 50 })
  @IsInt()
  @Min(10)
  total_amount: number;
}
