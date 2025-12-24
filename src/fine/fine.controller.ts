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
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Fines')
@Controller('fine')
export class FineController {
  constructor(private readonly fineService: FineService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a manual fine',
    description: 'Manually issues a fine to a user for a specific loan.',
  })
  @ApiResponse({
    status: 201,
    description: 'Fine created successfully.',
    type: ResponseFineDto,
  })
  @ApiResponse({ status: 404, description: 'User or Loan not found.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createFine(@Body() dto: CreateFineDto): Promise<ResponseFineDto> {
    const fine = await this.fineService.createFine(dto);
    return plainToInstance(ResponseFineDto, fine, {
      excludeExtraneousValues: true,
    });
  }

  @Post('pay/:id')
  @ApiOperation({
    summary: 'Pay a fine',
    description:
      'Updates a fine status to paid and records the payment timestamp.',
  })
  @ApiParam({
    name: 'id',
    description: 'The UUID of the fine record',
    example: '88496a1f-217a-499a-902f-4e88b09a23db',
  })
  @ApiResponse({
    status: 200,
    description: 'Fine paid successfully.',
    type: ResponseFineDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Fine is already paid or invalid input.',
  })
  @ApiResponse({ status: 404, description: 'Fine not found.' })
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
  @ApiOperation({
    summary: 'List all fines',
    description: 'Returns a complete list of all fines in the library system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of fines retrieved.',
    type: [ResponseFineDto],
  })
  async getAllFine(): Promise<ResponseFineDto[]> {
    const fines = await this.fineService.getAllFine();
    return plainToInstance(ResponseFineDto, fines, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get fine by ID',
    description:
      'Retrieves details of a specific fine including user and loan relations.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the fine' })
  @ApiResponse({
    status: 200,
    description: 'Fine found.',
    type: ResponseFineDto,
  })
  @ApiResponse({ status: 404, description: 'Fine not found.' })
  async getFineById(@Param('id') id: string): Promise<ResponseFineDto> {
    const fine = await this.fineService.getFineById(id);
    return plainToInstance(ResponseFineDto, fine, {
      excludeExtraneousValues: true,
    });
  }

  @Get('user/:userId')
  @ApiOperation({
    summary: 'Get fines by User',
    description: 'Retrieves all fine history for a specific library member.',
  })
  @ApiParam({ name: 'userId', description: 'The UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'List of user fines.',
    type: [ResponseFineDto],
  })
  async getFineByUser(
    @Param('userId') userId: string,
  ): Promise<ResponseFineDto[]> {
    const fines = await this.fineService.getFineByUser(userId);
    return plainToInstance(ResponseFineDto, fines, {
      excludeExtraneousValues: true,
    });
  }

  @Get('loan/:loanId')
  @ApiOperation({
    summary: 'Get fines by Loan',
    description: 'Retrieves any fines associated with a specific book loan.',
  })
  @ApiParam({ name: 'loanId', description: 'The UUID of the loan' })
  @ApiResponse({
    status: 200,
    description: 'Fine details for the loan.',
    type: [ResponseFineDto],
  })
  async getFineByLoan(
    @Param('loanId') loanId: string,
  ): Promise<ResponseFineDto[]> {
    const fines = await this.fineService.getFineByLoan(loanId);
    return plainToInstance(ResponseFineDto, fines, {
      excludeExtraneousValues: true,
    });
  }
}
