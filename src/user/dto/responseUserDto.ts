import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @ApiProperty({
    description: 'The unique identifier (UUID) of the user.',
    example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    format: 'uuid',
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'User first name.',
    example: 'John',
  })
  @Expose()
  first_name: string;

  @ApiProperty({
    description: 'User last name.',
    example: 'Doe',
  })
  @Expose()
  last_name: string;

  @ApiProperty({
    description: 'User email address.',
    example: 'john@example.com',
  })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Assigned system role.',
    example: 'admin',
  })
  @Expose()
  role: string;

  @ApiProperty({
    description: 'Indicates if the user account is currently active.',
    example: true,
  })
  @Expose()
  is_active: boolean;
}
