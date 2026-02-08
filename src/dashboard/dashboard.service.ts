import { Injectable, NotFoundException, UseGuards } from '@nestjs/common';
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
import { Repository } from 'typeorm';
import { LoanStatus } from 'src/loan/enums/loanStatus.enum';
import { MemberStatus } from 'src/user/enum/member.enum';
import { ReservationStatus } from 'src/reservation/enum/reservation.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Book) private readonly bookRepo: Repository<Book>,
    @InjectRepository(Loan) private readonly loanRepo: Repository<Loan>,
    @InjectRepository(Reservation)
    private readonly reservationRepo: Repository<Reservation>,
    @InjectRepository(Fine) private readonly fineRepo: Repository<Fine>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Category)
    private readonly categoryRepo: Repository<Category>,
  ) {}

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  async getAdminDashboard(): Promise<AdminDashboardDto> {
    const [
      totalBook,
      totalCopies,
      totalAvailableCopies,
      totalDamagedCopies,
      totalLoanedCopies,
      totalOverdueCopies,
      totalActiveUser,
      totalMembers,
      totalLibrarian,
      totalAdmin,
      totalReservations,
      totalFines,
      totalFineAmount,
      totalCategories,
    ] = await Promise.all([
      this.bookRepo.count(),

      this.bookRepo
        .createQueryBuilder('b')
        .select('SUM(b.total_copies)', 'sum')
        .getRawOne(),

      this.bookRepo
        .createQueryBuilder('b')
        .select('SUM(b.available_copies)', 'sum')
        .getRawOne(),

      this.bookRepo
        .createQueryBuilder('b')
        .select('SUM(b.damaged_copies)', 'sum')
        .getRawOne(),

      this.loanRepo.count({
        where: { status: LoanStatus.ISSUED },
      }),

      this.loanRepo.count({
        where: { status: LoanStatus.OVERDUE },
      }),

      this.userRepo.count({
        where: { is_active: true },
      }),

      this.userRepo.count({
        where: { role: MemberStatus.MEMBER, is_active: true },
      }),

      this.userRepo.count({
        where: { role: MemberStatus.LIBRARIAN, is_active: true },
      }),

      this.userRepo.count({
        where: { role: MemberStatus.ADMIN, is_active: true },
      }),

      this.reservationRepo.count({
        where: { status: ReservationStatus.PENDING },
      }),

      this.fineRepo.count({
        where: { paid: false },
      }),

      this.fineRepo
        .createQueryBuilder('f')
        .select('SUM(f.total_amount)', 'sum')
        .where({ paid: false })
        .getRawOne(),

      this.categoryRepo.count(),
    ]);

    return {
      totalBook,
      totalCopies: Number(totalCopies.sum) || 0,
      totalAvailableCopies: Number(totalAvailableCopies.sum) || 0,
      totalDamagedCopies: Number(totalDamagedCopies.sum) || 0,
      totalLoanedCopies,
      totalOverdueCopies,
      totalActiveUser,
      totalMembers,
      totalLibrarian,
      totalAdmin,
      totalReservations,
      totalFines,
      totalFineAmount: Number(totalFineAmount.sum) || 0,
      totalCategories,
    };
  }

  async getMemberDashboard(id: string): Promise<MemberDashboardDto> {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const [
      activeLoans,
      overdueLoans,
      totalReservation,
      totalFines,
      totalFineAmount,
    ] = await Promise.all([
      this.loanRepo.count({
        where: { user: { id }, status: LoanStatus.ISSUED },
      }),

      this.loanRepo.count({
        where: { user: { id }, status: LoanStatus.OVERDUE },
      }),

      this.reservationRepo.count({
        where: { user: { id }, status: ReservationStatus.PENDING },
      }),

      this.fineRepo.count({
        where: { user: { id }, paid: false },
      }),

      this.loanRepo
        .createQueryBuilder('l')
        .select('SUM(l.total_amount)', 'sum')
        .where({ paid: false })
        .getRawOne(),
    ]);

    return {
      activeLoans,
      overdueLoans,
      totalReservation,
      totalFines,
      totalFineAmount: Number(totalFineAmount.sum) || 0,
    };
  }
}
