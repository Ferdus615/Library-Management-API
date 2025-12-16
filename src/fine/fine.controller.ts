import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/createFineDto.dto';
import { ResponseFineDto } from './dto/responseFineDto.dto';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createFine(@Body() dto: CreateFineDto): Promise<ResponseFineDto> {
    return await this.fineService.createFine(dto);
  }

  @Post(':id')
  async payFine(@Param('id') id: string): Promise<ResponseFineDto> {
    return this.fineService.payFine(id);
  }

  
}
