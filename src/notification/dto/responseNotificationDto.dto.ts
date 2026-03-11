import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UUID } from 'typeorm/driver/mongodb/bson.typings.js';

export class ResponseNotificationDto {
  @ApiProperty({ type: UUID, example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  id: string;

  @ApiProperty({ type: UUID, example: '123e4567-e89b-12d3-a456-426614174000' })
  @Expose()
  user_id: string;

  @ApiProperty({ type: String, example: 'Book Reserved!' })
  @Expose()
  title: string;

  @ApiProperty({
    type: String,
    example: 'You have requested a reservation for "The Great Gatsby".',
  })
  @Expose()
  message: string;

  @ApiProperty({ type: String, example: 'RESERVATION_CREATED' })
  @Expose()
  type: string;

  @ApiProperty({ type: Boolean, example: false })
  @Expose({ name: 'is_read' })
  read: boolean;
}
