import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

// src/auth/dto/authenticated-user.dto.ts
export class AuthenticatedUserDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @Expose()
  email: string;

  @ApiProperty({ example: 'John' })
  @Expose()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @Expose()
  last_name: string;

  @ApiProperty({ example: 'member', description: 'User role in the system' })
  @Expose()
  role: string;

  @ApiProperty({ example: true })
  @Expose()
  is_active: boolean;
}
