import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { AdminDashboardDto } from './dto/adminDashboardDto.dto';
import { MemberDashboardDto } from './dto/memberDashboardDto.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @ApiOperation({
    summary: 'Get admin dashboard',
    description: 'Returns admin dashboard data',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin dashboard data',
    type: AdminDashboardDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  async getAdminDashboard(): Promise<AdminDashboardDto> {
    return await this.dashboardService.getAdminDashboard();
  }

  @Get('member')
  @ApiOperation({
    summary: 'Get member dashboard',
    description: 'Returns member dashboard data',
  })
  @ApiResponse({
    status: 200,
    description: 'Member dashboard data',
    type: MemberDashboardDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden',
  })
  @UseGuards(RolesGuard)
  @Roles(MemberStatus.MEMBER, MemberStatus.LIBRARIAN, MemberStatus.ADMIN)
  async getMemberDashboard(@Req() req): Promise<MemberDashboardDto> {
    return await this.dashboardService.getMemberDashboard(req.user.id);
  }
}
