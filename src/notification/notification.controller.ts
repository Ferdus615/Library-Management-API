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
  Query,
} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { NotificationQueryDto } from './dto/notificationQueryDto.dto';

@ApiTags('Notification')
@Controller('notification')
@UseGuards(RolesGuard)
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  @Roles(MemberStatus.ADMIN)
  @ApiOperation({ summary: 'Get all notifications for admin' })
  async findAllForAdmin(@Query() query: NotificationQueryDto) {
    return await this.notificationService.findAll(query);
  }

  @Get(':id')
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN, MemberStatus.MEMBER)
  @ApiOperation({ summary: 'Get all notifications for the current user' })
  async findAll(@Param('id') id: string) {
    return await this.notificationService.findAllByUser(id);
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
