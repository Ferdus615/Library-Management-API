import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/loginDto.dto';
import { AuthResponseDto } from './dto/responseAuthDto.dto';
import { plainToInstance } from 'class-transformer';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async LoginAuthDto(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    const isUser = await this.authService.validateUser(dto);
    if (!isUser) throw new UnauthorizedException('Invalid email or password');

    const authenticatedUser = await this.authService.login(isUser);

    return plainToInstance(AuthResponseDto, authenticatedUser, {
      excludeExtraneousValues: true,
    });
  }
}
