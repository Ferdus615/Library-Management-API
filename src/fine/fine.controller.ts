import {
  Body,
  Controller,
  Get,
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
import { plainToInstance } from 'class-transformer';
import { PayFineDto } from './dto/payFineDto.dto';

@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createFine(@Body() dto: CreateFineDto): Promise<ResponseFineDto> {
    const fine = await this.fineService.createFine(dto);
    return plainToInstance(ResponseFineDto, fine, {
      excludeExtraneousValues: true,
    });
  }

  @Post('pay/:id')
  async payFine(
    @Param('id') id: string,
    @Body() dto: PayFineDto,
  ): Promise<ResponseFineDto> {
    const payFine = await this.fineService.payFine(id, dto);
    return plainToInstance(ResponseFineDto, payFine, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async getAllFine(): Promise<ResponseFineDto[]> {
    const fines = await this.fineService.getAllFine();
    return plainToInstance(ResponseFineDto, fines, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  async getFineById(@Param() id: string): Promise<ResponseFineDto> {
    const fine = await this.fineService.getFineById(id);
    return plainToInstance(ResponseFineDto, fine, {
      excludeExtraneousValues: true,
    });
  }

  @Get('user/:userId')
  async getFineByUser(@Param() userId: string): Promise<ResponseFineDto[]> {
    const fines = await this.fineService.getFineByUser(userId);
    return plainToInstance(ResponseFineDto, fines, {
      excludeExtraneousValues: true,
    });
  }

  @Get('loan/:loanId')
  async getFineByLoan(@Param() loanId: string): Promise<ResponseFineDto[]> {
    const fines = await this.fineService.getFineByLoan(loanId);
    return plainToInstance(ResponseFineDto, fines, {
      excludeExtraneousValues: true,
    });
  }
}
