import { SetMetadata } from '@nestjs/common';
import { MemberStatus } from 'src/user/enum/member.enum';

export const Roles = (...roles: MemberStatus[]) => SetMetadata('roles', roles);
