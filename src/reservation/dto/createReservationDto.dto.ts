import { IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  user_id: string;

  @IsUUID()
  book_id: string;
}
