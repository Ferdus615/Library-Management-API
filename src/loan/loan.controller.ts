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
import { UpdateLoanDto } from './dto/updateLoanDto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
@ApiTags('Loans')
@Controller('loan')
export class LoanController {
  constructor(private readonly loanService: LoanService) {}

  @Post()
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'Issue a new book loan',
    description:
      'Creates a loan record for a user and a book. Decrements available copies.',
  })
  @ApiResponse({ status: 201, type: ResponseLoanDto })
  async createLoan(@Body() dto: CreateLoanDto): Promise<ResponseLoanDto> {
    return await this.loanService.createLoan(dto);
  }

  @Get()
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @UseGuards(RolesGuard)
  @ApiOperation({
    summary: 'List all loans',
    description: 'Retrieves a history of all loans (active and returned).',
  })
  @ApiResponse({ status: 200, type: [ResponseLoanDto] })
  async findAllLoan(): Promise<ResponseLoanDto[]> {
    return await this.loanService.findAllLoan();
  }

  @Get('/:id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Get loan details by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseLoanDto })
  async findOneLoan(@Param('id') id: string): Promise<ResponseLoanDto> {
    return await this.loanService.findOneLoan(id);
  }

  @Patch('/:id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @UseGuards(RolesGuard)
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
    return await this.loanService.updateLoan(id, dto);
  }

  @Delete('/:id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Hard delete a loan record' })
  @ApiResponse({ status: 200, description: 'Loan successfully deleted.' })
  async deleteLoan(@Param('id') id: string) {
    return await this.loanService.deleteLoan(id);
  }
}
