import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto.dto';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsBoolean()
  is_active: boolean;
}
