import { IsBoolean, IsString } from 'class-validator';
import { User } from '../entities/user.entity';

export class ResponseUserDto {
  @IsString()
  id: string;

  @IsString()
  first_name: string;

  @IsString()
  last_name: string;

  @IsString()
  email: string;

  @IsString()
  role: string;

  @IsBoolean()
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
