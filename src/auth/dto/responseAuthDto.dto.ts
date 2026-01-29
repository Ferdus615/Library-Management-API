import { ApiProperty } from '@nestjs/swagger';

class UserInfo {
  @ApiProperty({ example: 'uuid-string' })
  id: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email: string;

  @ApiProperty({ example: 'admin', required: false })
  role?: string;
}

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'The JWT access token',
  })
  access_token: string;

  @ApiProperty({ type: UserInfo })
  user: UserInfo;
}
