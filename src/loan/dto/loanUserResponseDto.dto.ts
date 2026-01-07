import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class LoanUserResponseDto {
  @ApiProperty({ description: 'The unique UUID of the member', format: 'uuid' })
  @Expose()
  id: string;

  @ApiProperty({ description: 'Member first name', example: 'Jane' })
  @Expose()
  first_name: string;

  @ApiProperty({ description: 'Member last name', example: 'Smith' })
  @Expose()
  last_name: string;

  @ApiProperty({ description: 'Contact email', example: 'janesmith@email.com' })
  @Expose()
  email: string;

  @ApiProperty({
    description: 'Contact phone number',
    example: '018XXXXXXXX',
    nullable: true,
  })
  @Expose()
  phone: string;
}
