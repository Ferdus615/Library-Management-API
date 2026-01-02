import { IsUUID } from 'class-validator';

export class ResponseReservationDto {
  @IsUUID()
  id: string;

  status: string;

  user: string;

  book: string;

  ready_at: Date;

  expires_at: Date;

  created_at: Date;
}
