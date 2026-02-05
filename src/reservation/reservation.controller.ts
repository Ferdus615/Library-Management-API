import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/responseReservationDto.dto';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
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

  @Get()
  @ApiOperation({
    summary: 'Get all reservations',
    description: 'Returns a complete list of all reservations in the system.',
  })
  @ApiResponse({ status: 200, type: [ResponseReservationDto] })
  async findAllReservatios(): Promise<ResponseReservationDto[]> {
    return await this.reservationService.findAllReservatios();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation details by ID' })
  @ApiParam({ name: 'id', description: 'Reservation UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseReservationDto })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async findOneReservation(
    @Param('id') id: string,
  ): Promise<ResponseReservationDto> {
    return await this.reservationService.findOneReservation(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Cancel a reservation',
    description: 'Updates the reservation status to CANCELLED.',
  })
  @ApiParam({ name: 'id', description: 'Reservation UUID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Reservation cancelled.',
    type: ResponseReservationDto,
  })
  @ApiResponse({ status: 404, description: 'Reservation not found.' })
  async cancleReservation(
    @Param('id') id: string,
  ): Promise<ResponseReservationDto> {
    return await this.reservationService.cancleReservation(id);
  }
}
