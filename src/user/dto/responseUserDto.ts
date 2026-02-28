import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MemberStatus } from '../enum/member.enum';

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
    description: 'User phone number.',
    example: '1234567890',
  })
  @Expose()
  phone: string | null;

  @ApiProperty({
    description: 'User address.',
    example: '123 Main St',
  })
  @Expose()
  address: string | null;

  @ApiProperty({
    description: 'Assigned system role.',
    example: 'admin',
  })
  @Expose()
  role: MemberStatus;

  @ApiProperty({
    description: 'Indicates if the user account is currently active.',
    example: true,
  })
  @Expose()
  is_active: boolean;

  @ApiProperty({
    description: 'The date and time when the user was created.',
    example: '2022-01-01T00:00:00.000Z',
  })
  @Expose()
  created_at: Date;
}
