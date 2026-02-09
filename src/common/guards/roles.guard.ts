import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MemberStatus } from 'src/user/enum/member.enum';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: { role?: MemberStatus; email?: string };
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<MemberStatus[]>(
      'roles',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    console.log('RolesGuard Check:', {
      requiredRoles,
      userRole: user?.role,
      userEmail: user?.email,
      path: request.url,
    });

    if (!user || !user.role) {
      console.error('RolesGuard: No user or role found in request');
      return false;
    }

    const hasRole = requiredRoles.includes(user.role);
    if (!hasRole) {
      console.error(
        `RolesGuard: User role ${user.role} not in required roles ${requiredRoles.join(', ')}`,
      );
    }

    return hasRole;
  }
}
