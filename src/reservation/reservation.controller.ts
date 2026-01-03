import { Body, Controller, Post } from '@nestjs/common';
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
}
