import { Injectable } from '@nestjs/common';
import { AdminDashboardDto } from './dto/adminDashboardDto.dto';
import { MemberDashboardDto } from './dto/memberDashboardDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from 'src/book/entities/book.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { User } from 'src/user/entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Fine } from 'src/fine/entities/fine.entity';
import { Category } from 'src/category/entities/category.entity';
import { Notification } from 'src/notification/entities/notification.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Book)
    @InjectRepository(Loan)
    @InjectRepository(Reservation)
    @InjectRepository(Fine)
    @InjectRepository(User)
    @InjectRepository(Category)
    @InjectRepository(Notification)
  ) {}

  async getAdminDashboard(): Promise<AdminDashboardDto> {}

  async getMemberDashboard(id: any): Promise<MemberDashboardDto> {}
}
