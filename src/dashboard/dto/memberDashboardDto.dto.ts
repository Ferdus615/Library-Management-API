import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class MemberDashboardDto {
  @ApiProperty({ description: 'Total active loans count', example: 4 })
  @Expose()
  activeLoans: number;

  @ApiProperty({ description: 'Total overdue loans count', example: 2 })
  @Expose()
  overdueLoans: number;

  @ApiProperty({ description: 'Total reservations count', example: 5 })
  @Expose()
  totalReservation: number;

  @ApiProperty({ description: 'Total fines count', example: 3 })
  @Expose()
  totalFines: number;

  @ApiProperty({ description: 'Total fine amount', example: 100 })
  @Expose()
  totalFineAmount: number;
}
