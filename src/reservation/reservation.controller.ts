import { Body, Controller, Get, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/createReservationDto.dto';
import { ResponseReservationDto } from './dto/rseponseReservationDto.dto';
import { plainToInstance } from 'class-transformer';

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
}
