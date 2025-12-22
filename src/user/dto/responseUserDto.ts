import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Expose } from 'class-transformer';

export class ResponseUserDto {
  @ApiProperty({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'John' })
  @Expose()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  last_name: string;

  @ApiProperty({ example: 'john@example.com' })
  email: string;

  @ApiProperty({ example: 'admin' })
  role: string;

  @ApiProperty({ example: true })
  is_active: boolean;

  constructor(user: User) {
    this.id = user.id;
    this.first_name = user.first_name;
    this.last_name = user.last_name;
    this.email = user.email;
    this.role = user.role;
    this.is_active = user.is_active;
  }
}
