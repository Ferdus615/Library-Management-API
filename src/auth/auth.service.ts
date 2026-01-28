import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const findUser = await this.userService.findByEmail(email);
    if (!findUser) return null;

    const checkPassword = await bcrypt.compare(password, findUser.password);
    if (!checkPassword) return null;

    return findUser;
  }
}
