import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/loginDto.dto';
import { AuthResponseDto } from './dto/responseAuthDto.dto';
import { AuthenticatedUserDto } from './dto/AuthenticatedUserDto.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(dto: LoginDto): Promise<AuthenticatedUserDto | null> {
    const findUser = await this.userService.findUserByEmailWithPassword(
      dto.email,
    );
    if (!findUser) return null;

    const matchPassword = await bcrypt.compare(dto.password, findUser.password);
    if (!matchPassword) return null;

    const { password: _, ...userWithoutPassword } = findUser;

    return plainToInstance(AuthenticatedUserDto, userWithoutPassword, {
      excludeExtraneousValues: true,
    });
  }

  async login(user: AuthenticatedUserDto): Promise<AuthResponseDto> {
    const payload = {
      email: user.email,
      sub: user.id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: user,
    };
  }
}
