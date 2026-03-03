import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Notification')
@Controller('notification')
@UseGuards(RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  async findAll(@Req() req) {
    return await this.notificationService.findAllByUser(req.user.id);
  }

  @Patch(':id/read')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(@Param('id') id: string, @Req() req) {
    return await this.notificationService.markAsRead(id, req.user.id);
  }

  @Delete(':id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({ summary: 'Delete a notification' })
  async remove(@Param('id') id: string, @Req() req) {
    return await this.notificationService.remove(id, req.user.id);
  }
}
