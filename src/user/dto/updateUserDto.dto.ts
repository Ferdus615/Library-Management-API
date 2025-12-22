import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
