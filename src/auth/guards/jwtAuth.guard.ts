import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class JwtAuthGuard implements canActivate {
  constructor(private readonly jwtService: JwrService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
  }
}
