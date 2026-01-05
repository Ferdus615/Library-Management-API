import { Expose } from 'class-transformer';

export class ReservationUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  email: string;

  @Expose()
  phone: string;

  @Expose()
  address: string;
}
