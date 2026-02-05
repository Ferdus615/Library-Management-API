import { Expose, Type } from 'class-transformer';
import { ReservationUserResponseDto } from './reservationUserResponseDto.dto';
import { ReservationBookResponseDto } from './reservationBookResponseDto.dto';
import { ReservationStatus } from '../enum/reservation.enum';
import { ApiProperty } from '@nestjs/swagger';

export class ResponseReservationDto {
  @ApiProperty({
    description: 'Unique identifier for the reservation',
    example: '88496a1f-217a-499a-902f-4e88b09a23db',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Current status of the reservation',
    enum: ReservationStatus,
    example: ReservationStatus.PENDING,
  })
  @Expose()
  status: ReservationStatus;

  @ApiProperty({
    description: 'Details of the user who made the reservation',
    type: ReservationUserResponseDto,
  })
  @Expose()
  @Type(() => ReservationUserResponseDto)
  user: ReservationUserResponseDto;

  @ApiProperty({
    description: 'Details of the reserved book',
    type: ReservationBookResponseDto,
  })
  @Expose()
  @Type(() => ReservationBookResponseDto)
  book: ReservationBookResponseDto;

  @ApiProperty({
    description: 'Timestamp when the book became available for pickup',
    example: '2026-01-05T10:00:00Z',
    nullable: true,
  })
  @Expose()
  ready_at: Date;

  @ApiProperty({
    description: 'Timestamp when the reservation will expire if not picked up',
    example: '2026-01-06T10:00:00Z',
    nullable: true,
  })
  @Expose()
  expires_at: Date;

  @ApiProperty({
    description: 'Timestamp when the reservation was created',
    example: '2026-01-04T22:30:00Z',
  })
  @Expose()
  created_at: Date;
}
