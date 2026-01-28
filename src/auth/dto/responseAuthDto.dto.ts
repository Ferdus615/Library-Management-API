import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './loginDto.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
