import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FineUserResponseDto {
  @ApiProperty({
    description: 'The unique identifier of the user.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'The first name of the member.',
    example: 'John',
  })
  @Expose()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the member.',
    example: 'Doe',
  })
  @Expose()
  last_name: string;

  @ApiProperty({
    description: 'The email address of the user.',
    example: 'john.doe@example.com',
  })
  @Expose()
  email: string;
}
