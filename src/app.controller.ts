import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './auth/decorators/public.decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  @ApiOperation({
    summary: 'Health Check',
    description: 'Returns a simple health check response.',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check response.',
    type: String,
  })
  healthCheck(): string {
    return 'OK';
  }

  @Public()
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
