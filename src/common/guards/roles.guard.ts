import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberStatus } from 'src/user/enum/member.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<MemberStatus[]>(
      'roles',
      context.getHandler(),
    );

    if (!requiredRoles) return true;

    const rerquest = context.switchToHttp().getRequest();
    const user = rerquest.user as { role: MemberStatus };

    if (!user || !user.role) return false;

    return requiredRoles.includes(user.role);
  }
}
