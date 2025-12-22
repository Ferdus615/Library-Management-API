import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'John' })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({ example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'strongPassword123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({ example: '01711223344' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({ example: '123 Tech Avenue, Dhaka' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    example: 'member',
    enum: ['admin', 'librarian', 'member'],
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  membership_expiry?: Date;
}

// users = [
//   {
//   "first_name": "John",
//   "last_name": "Doe",
//   "email": "john.doe@example.com",
//   "password": "strongPassword123!",
//   "phone": "01711223344",
//   "address": "123 Tech Avenue, Dhaka",
//   "role": "member"
// },
// {
//     "first_name": "Alice",
//     "last_name": "Johnson",
//     "email": "alice.johnson@example.com",
//     "password": "AlicePassword123!",
//     "phone": "01711000001",
//     "address": "42 Maple Street, Dhaka",
//     "role": "member"
//   },
//   {
//     "first_name": "Bob",
//     "last_name": "Williams",
//     "email": "bob.williams@example.com",
//     "password": "BobSecurePass456",
//     "phone": "01922000002",
//     "role": "member"
//   },
//   {
//     "first_name": "Charlie",
//     "last_name": "Brown",
//     "email": "charlie.brown@example.com",
//     "password": "CharliePass789!",
//     "address": "101 Oak Avenue, Sylhet",
//     "role": "admin"
//   },
//   {
//     "first_name": "Diana",
//     "last_name": "Evans",
//     "email": "diana.evans@example.com",
//     "password": "DianaLongPassword2025",
//     "role": "member"
//   },
//   {
//     "first_name": "Evan",
//     "last_name": "Wright",
//     "email": "evan.wright@example.com",
//     "password": "EvanTesting!@#",
//     "phone": "01555000005",
//     "address": "Sector 7, Uttara, Dhaka",
//     "role": "librarian"
//   }
// ]
