import { Expose, Type } from 'class-transformer';
import { ReservationUserResponseDto } from './reservationUserResponseDto.dto';
import { ReservationBookResponseDto } from './reservationBookResponseDto.dto';
import { ReservationStatus } from '../enum/reservation.enum';

export class ResponseReservationDto {
  @Expose()
  id: string;

  @Expose()
  status: ReservationStatus;

  @Expose()
  @Type(() => ReservationUserResponseDto)
  user: ReservationUserResponseDto;

  @Expose()
  @Type(() => ReservationBookResponseDto)
  book: ReservationBookResponseDto;

  @Expose()
  ready_at: Date;

  @Expose()
  expires_at: Date;

  @Expose()
  created_at: Date;
}
