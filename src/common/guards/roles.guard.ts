import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberStatus } from 'src/user/enum/member.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MemberStatus[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const rerquest = context.switchToHttp().getRequest();
    const user = rerquest.user as { role?: MemberStatus };

    if (!user || !user.role) return false;

    console.log({
      requiredRoles,
      userRole: user?.role,
    });

    return requiredRoles.includes(user.role);
  }
}
