import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class AdminDashboardDto {
  @ApiProperty({ description: 'Total number of books', example: 100 })
  @Expose()
  totalBook: number;

  @ApiProperty({ description: 'Total number of copies', example: 100 })
  @Expose()
  totalCopies: number;

  @ApiProperty({
    description: 'Total number of available copies',
    example: 100,
  })
  @Expose()
  totalAvailableCopies: number;

  @ApiProperty({ description: 'Total number of damaged copies', example: 100 })
  @Expose()
  totalDamagedCopies: number;

  @ApiProperty({ description: 'Total number of loaned copies', example: 100 })
  @Expose()
  totalLoanedCopies: number;

  @ApiProperty({ description: 'Total number of overdue copies', example: 100 })
  @Expose()
  totalOverdueCopies: number;

  @ApiProperty({ description: 'Total number of active users', example: 100 })
  @Expose()
  totalActiveUser: number;

  @ApiProperty({ description: 'Total number of active members', example: 100 })
  @Expose()
  totalMembers: number;

  @ApiProperty({
    description: 'Total number of active librarians',
    example: 100,
  })
  @Expose()
  totalLibrarian: number;

  @ApiProperty({ description: 'Total number of active admins', example: 100 })
  @Expose()
  totalAdmin: number;

  @ApiProperty({ description: 'Total number of reservations', example: 100 })
  @Expose()
  totalReservations: number;

  @ApiProperty({ description: 'Total number of unpaid fines', example: 100 })
  @Expose()
  totalFines: number;

  @ApiProperty({ description: 'Total unpaid fine amount', example: 100 })
  @Expose()
  totalFineAmount: number;
}
