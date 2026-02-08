import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { AdminDashboardDto } from './dto/adminDashboardDto.dto';
import { MemberDashboardDto } from './dto/memberDashboardDto.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('admin')
  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  async getAdminDashboard(): Promise<AdminDashboardDto> {
    return await this.dashboardService.getAdminDashboard();
  }

  @Get('member')
  async getMemberDashboard(@Req() req): Promise<MemberDashboardDto> {
    return await this.dashboardService.getMemberDashboard(req.user.id);
  }
}
