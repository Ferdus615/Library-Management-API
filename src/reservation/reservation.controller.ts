import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/rseponseReservationDto.dto';
import { plainToInstance } from 'class-transformer';
import { ApiOperation } from '@nestjs/swagger';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async createReservation(
    @Body() dto: CreateReservationDto,
  ): Promise<ResponseReservationDto> {
    const reservation = await this.reservationService.createReservation(dto);
    return plainToInstance(ResponseReservationDto, reservation, {
      excludeExtraneousValues: true,
    });
  }

  @Get()
  async findAllReservatios(): Promise<ResponseReservationDto[]> {
    const reservations = await this.reservationService.findAllReservatios();
    return reservations.map((res) =>
      plainToInstance(ResponseReservationDto, res, {
        excludeExtraneousValues: true,
      }),
    );
  }

  @Get(':id')
  async findOneReservation(
    @Param('id') id: string,
  ): Promise<ResponseReservationDto> {
    const reservation = await this.reservationService.findOneReservation(id);
    return plainToInstance(ResponseReservationDto, reservation, {
      excludeExtraneousValues: true,
    });
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
    const reservation = await this.reservationService.cancleReservation(id);
    return plainToInstance(ResponseReservationDto, reservation, {
      excludeExtraneousValues: true,
    });
  }
}
