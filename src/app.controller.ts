import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({
    summary: 'API Root',
    description:
      'Returns a welcome message or system status to verify the API is running.',
  })
  @ApiResponse({
    status: 200,
    description: 'Mama mia, worldo! Esse meee.',
    type: String,
  })
  getHello(): string {
    return this.appService.getHello();
  }
}
