import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { CreateLoanDto } from './dto/createLoanDto.dto';
import { ResponseLoanDto } from './dto/responseLoanDto.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateLoanDto } from './dto/updateLoanDto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { Public } from 'src/auth/decorators/public.decorators';

@ApiTags('Loans')
@ApiBearerAuth()
@Roles(MemberStatus.ADMIN)
@UseGuards(RolesGuard)
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @ApiOperation({
    summary: 'Issue a new book loan',
    description:
      'Creates a loan record for a user and a book. Decrements available copies.',
  })
  @ApiResponse({ status: 201, type: ResponseLoanDto })
  async createLoan(@Body() dto: CreateLoanDto): Promise<ResponseLoanDto> {
    const loan = await this.loanService.createLoan(dto);
    return plainToInstance(ResponseLoanDto, loan, {
      excludeExtraneousValues: true,
    });
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'List all loans',
    description: 'Retrieves a history of all loans (active and returned).',
  })
  @ApiResponse({ status: 200, type: [ResponseLoanDto] })
  async findAllLoan(): Promise<ResponseLoanDto[]> {
    const loans = await this.loanService.findAllLoan();
    return loans.map((loan) =>
      plainToInstance(ResponseLoanDto, loan, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Public()
  @Get('/:id')
  @ApiOperation({ summary: 'Get loan details by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseLoanDto })
  async findOneLoan(@Param('id') id: string): Promise<ResponseLoanDto> {
    const loan = await this.loanService.findOneLoan(id);
    return plainToInstance(ResponseLoanDto, loan, {
      excludeExtraneousValues: true,
    });
  }

  @Patch('/:id')
  @ApiOperation({
    summary: 'Update loan status or return date',
    description:
      'Used when a book is returned or a loan is renewed. If you are returning a book the return_date has to be sent, status can is optional.',
  })
  @ApiResponse({ status: 200, type: ResponseLoanDto })
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
  @ApiOperation({ summary: 'Hard delete a loan record' })
  @ApiResponse({ status: 200, description: 'Loan successfully deleted.' })
  async deleteLoan(@Param('id') id: string) {
    return await this.loanService.deleteLoan(id);
  }
}
