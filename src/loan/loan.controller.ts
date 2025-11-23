import { Body, Controller, Post } from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/createLoanDto.dto';
import { ResponseLoanDto } from './dto/responseLoanDto.dto';
import { plainToInstance } from 'class-transformer';

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
}
