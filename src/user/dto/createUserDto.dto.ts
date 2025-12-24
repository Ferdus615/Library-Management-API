import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the library member.',
    example: 'John',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @ApiProperty({
    description: 'The last name of the library member.',
    example: 'Doe',
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  last_name: string;

  @ApiProperty({
    description: 'A unique email address used for login and notifications.',
    example: 'john.doe@example.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Secure password for the user account (minimum 8 characters).',
    example: 'strongPassword123!',
    minLength: 8,
    writeOnly: true, // Ensures password isn't shown in Swagger response examples
  })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiPropertyOptional({
    description: 'Contact phone number (maximum 11 digits).',
    example: '01711223344',
    maxLength: 11,
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Physical residential address of the user.',
    example: '123 Tech Avenue, Dhaka',
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({
    description: 'The access level/role assigned to the user.',
    example: 'member',
    enum: ['admin', 'librarian', 'member'],
    default: 'member',
  })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional({
    description: 'The date when the library membership expires.',
    example: '2026-12-31',
    type: Date,
  })
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
