import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class CreateReservationDto {
  @ApiProperty({
    description: 'The UUID of the user making the reservation',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    format: 'uuid',
  })
  @IsUUID()
  user_id: string;

  @ApiProperty({
    description: 'The UUID of the book to be reserved',
    example: 'f7b4c1a2-3b9d-4e5f-8c1a-2b3c4d5e6f7g',
    format: 'uuid',
  })
  @IsUUID()
  book_id: string;
}
