import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { AuthenticatedUserDto } from './AuthenticatedUserDto.dto';
export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The JWT access token',
  })
  @Expose()
  access_token: string;

  @ApiProperty({ type: AuthenticatedUserDto })
  @Expose()
  @Type(() => AuthenticatedUserDto)
  user: AuthenticatedUserDto;
}
