import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './createUserDto.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
