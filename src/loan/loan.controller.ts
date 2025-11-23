import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/createLoanDto.dto';
import { ResponseLoanDto } from './dto/responseLoanDto.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateLoanDto } from './dto/updateLoanDto';

@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  async createLoan(@Body() dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const loan = await this.loanService.createLoan(dto);
    return plainToInstance(ResponseLoanDto, loan, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAllLoan(): Promise<ResponseLoanDto[]> {
    const loans = await this.loanService.findAllLoan();
    return loans.map((loan) =>
      plainToInstance(ResponseLoanDto, loan, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get('/:id')
  async findOneLoan(@Param('id') id: string): Promise<ResponseLoanDto> {
    const loan = await this.loanService.findOneLoan(id);
    return plainToInstance(ResponseLoanDto, loan, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('/:id')
  async updateLoan(
    @Param('id') id: string,
    @Body() dto: UpdateLoanDto,
  ): Promise<ResponseLoanDto> {
    const loan = await this.loanService.updateLoan(id, dto);
    return plainToInstance(ResponseLoanDto, loan, {
      excludeExtraneousValues: true,
    });
  }

  @Delete('/:id')
  async deleteLoan(@Param('id') id: string) {
    return await this.loanService.deleteLoan(id);
  }
}
