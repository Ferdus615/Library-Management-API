import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Fine } from './entities/fine.entity';
import { User } from 'src/user/entities/user.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { CreateFineDto } from './dto/createFineDto.dto';
import { ResponseFineDto } from './dto/responseFineDto.dto';
import { PayFineDto } from './dto/payFineDto.dto';
import { LoanStatus } from 'src/loan/enums/loanStatus.enum';

@Injectable()
export class FineService {
  constructor(
    @InjectRepository(Fine) private readonly fineRepository: Repository<Fine>,
    @InjectRepository(User) private readonly userRepositoty: Repository<User>,
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
  ) {}

  async createFine(dto: CreateFineDto): Promise<ResponseFineDto> {
    const findUser = await this.userRepositoty.findOne({
      where: { id: dto.user_id },
    });
    if (!findUser) throw new NotFoundException(`User not found!`);

    const findLoan = await this.loanRepository.findOne({
      where: { id: dto.loan_id, user: { id: dto.user_id } },
    });
    if (!findLoan)
      throw new NotFoundException(
        `Loan not found OR loan dosen't belong to this user!`,
      );

    const existingFine = await this.fineRepository.findOne({
      where: { loan: { id: dto.loan_id } },
    });
    if (existingFine)
      throw new BadRequestException(`A fine already exist for this loan!`);

    if (findLoan.status === LoanStatus.OVERDUE) {
      const fine = this.fineRepository.create({
        user: findUser,
        loan: findLoan,
        total_amount: dto.total_amount,
        paid: false,
      });

      const savedFine = await this.fineRepository.save(fine);

      return plainToInstance(ResponseFineDto, savedFine);
    } else {
      throw new BadRequestException(`The loan is not overdue yet!`);
    }
  }

  async payFine(id: string, dto: PayFineDto): Promise<ResponseFineDto> {
    const findFine = await this.fineRepository.findOne({ where: { id } });
    if (!findFine) throw new NotFoundException(`Fine not found!`);
    if (findFine.paid) throw new BadRequestException('Fine already paid!');

    if (dto.paid !== undefined) findFine.paid = dto.paid;

    findFine.paid_at = dto.paid_at || new Date();

    const savedFine = await this.fineRepository.save(findFine);

    return plainToInstance(ResponseFineDto, savedFine);
  }

  async getAllFine(): Promise<ResponseFineDto[]> {
    const findFines = await this.fineRepository.find();
    return findFines.map((fine) => plainToInstance(ResponseFineDto, fine));
  }

  async getFineById(id: string): Promise<ResponseFineDto> {
    const findFine = await this.fineRepository.findOne({ where: { id } });
    if (!findFine) throw new NotFoundException(`Fine not found!`);

    return plainToInstance(ResponseFineDto, findFine);
  }

  async getFineByUser(userId: string): Promise<ResponseFineDto[]> {
    const findFines = await this.fineRepository.find({
      where: { user: { id: userId } },
    });

    return findFines.map((fine) => plainToInstance(ResponseFineDto, fine));
  }

  async getFineByLoan(loanId: string): Promise<ResponseFineDto[]> {
    const findFines = await this.fineRepository.find({
      where: { loan: { id: loanId } },
    });

    return findFines.map((fine) => plainToInstance(ResponseFineDto, fine));
  }
}
