import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ReservationUserResponseDto {
  @ApiProperty({
    description: 'The unique UUID of the user',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The legal first name of the member',
    example: 'John',
  })
  @Expose()
  first_name: string;

  @ApiProperty({
    description: 'The legal last name of the member',
    example: 'Doe',
  })
  @Expose()
  last_name: string;

  @ApiProperty({
    description: 'The verified email address of the user',
    example: 'johndoe@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'The primary contact number for pickup notifications',
    example: '01712345678',
    nullable: true,
  })
  @Expose()
  phone: string;

  @ApiProperty({
    description: 'The residential address for library records',
    example: '123 Library Lane, Dhaka',
    nullable: true,
  })
  @Expose()
  address: string;
}
