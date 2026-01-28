import { PartialType } from '@nestjs/swagger';
import { CreateAuthDto } from './createAuthDto.dto';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {}
