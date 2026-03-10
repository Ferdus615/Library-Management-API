import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/responseReservationDto.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { ReservationQueryDto } from './dto/reservationQueryDto.dto';

@ApiTags('Reservations')
@UseGuards(RolesGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({
    summary: 'Create a new book reservation',
    description:
      'Places a user in the waitlist for a book. Fails if the book is currently available for direct loan.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reservation successfully created.',
    type: ResponseReservationDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Book is available for direct loan.',
  })
  @ApiResponse({ status: 404, description: 'User or Book not found.' })
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @HttpCode(HttpStatus.CREATED)
  async createReservation(
    @Body() dto: CreateReservationDto,
  ): Promise<ResponseReservationDto> {
    return await this.reservationService.createReservation(dto);
  }

  @Post('/receive/:id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @ApiOperation({
    summary: 'Receive a reservation for a book',
    description: 'Creates a loan from a reservation.',
  })
  @ApiParam({ name: 'id', description: 'Reservation UUID', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Reservation received successfully.',
    type: ResponseLoanDto,
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  @ApiResponse({ status: 400, description: 'Reservation not ready for loan.' })
  async receiveReservation(@Param('id') id: string): Promise<ResponseLoanDto> {
    return await this.reservationService.receiveReservation(id);
  }

  @Get()
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @ApiOperation({
    summary: 'Get all reservations for books',
    description: 'Returns a paginated list of all reservations in the system.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of reservations retrieved.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ResponseReservationDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async findAllReservatios(@Query() query: ReservationQueryDto): Promise<{
    data: ResponseReservationDto[];
    total: number;
  }> {
    return await this.reservationService.findAllReservatios(query);
  }

  @Get(':id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({
    summary: 'Get reservation details by ID',
    description: 'Returns a reservation by ID.',
  })
  @ApiParam({ name: 'id', description: 'Reservation UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseReservationDto })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async findOneReservation(
    @Param('id') id: string,
  ): Promise<ResponseReservationDto> {
    return await this.reservationService.findOneReservation(id);
  }

  @Get('/book/:id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @ApiOperation({
    summary: 'Get reservation details by book ID',
    description: 'Returns a reservation by book ID.',
  })
  @ApiParam({ name: 'id', description: 'Book UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseReservationDto })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async findReservationByBook(
    @Param('id') id: string,
  ): Promise<ResponseReservationDto[]> {
    return await this.reservationService.findReservationByBook(id);
  }

  @Patch('/cancel/:id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({
    summary: 'Cancel a reservation for a book',
    description: 'Updates the reservation status to CANCELLED.',
  })
  @ApiParam({ name: 'id', description: 'Reservation UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled.',
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async cancelReservation(
    @Param('id') id: string,
  ): Promise<{ message: string }> {
    return await this.reservationService.cancelReservation(id);
  }
}
