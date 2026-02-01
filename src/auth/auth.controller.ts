import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto.dto';
import { AuthResponseDto } from './dto/responseAuthDto.dto';
import { plainToInstance } from 'class-transformer';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Public } from './decorators/public.decorators';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ApiOperation({
    summary: '[Public] Authentication user and return JWT',
    description: 'Login user and return JWT',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful.',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unathurized: Invalid credentials.',
  })
  async LoginAuthDto(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const isUser = await this.authService.validateUser(dto);
    if (!isUser) throw new UnauthorizedException('Invalid email or password');

    const authenticatedUser = await this.authService.login(isUser);

    return plainToInstance(AuthResponseDto, authenticatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
