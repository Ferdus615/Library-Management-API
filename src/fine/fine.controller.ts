import { Body, Controller, Post } from '@nestjs/common';
import { FineService } from './fine.service';
import { CreateFineDto } from './dto/createFineDto.dto';
import { ResponseFineDto } from './dto/responseFineDto.dto';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  async createFine(@Body() dto: CreateFineDto): Promise<ResponseFineDto> {
    return await this.fineService.createFine(dto);
  }

  @
}
