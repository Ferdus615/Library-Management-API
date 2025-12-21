import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Fine } from './entities/fine.entity';
import { User } from 'src/user/entities/user.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { CreateFineDto } from './dto/createFineDto.dto';
import { ResponseFineDto } from './dto/responseFineDto.dto';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class FineService {
  constructor(
    @InjectRepository(Fine) private readonly fineRepository: Repository<Fine>,
    @InjectRepository(User) private readonly userRepositoty: Repository<User>,
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
  ) {}

  async createFine(dto: CreateFineDto): Promise<ResponseFineDto> {
    const user = await this.userRepositoty.findOne({
      where: { id: dto.user_id },
    });
    if (!user) throw new NotFoundException(`User not found!`);

    const loan = await this.loanRepository.findOne({
      where: { id: dto.loan_id },
    });
    if (!loan) throw new NotFoundException(`Loan not found!`);

    const fine = this.fineRepository.create({
      user,
      loan,
      total_amount: dto.total_amount,
      paid: false,
    });

    const saveFine = await this.fineRepository.save(fine);

    return plainToInstance(ResponseFineDto, saveFine);
  }

  async payFine(id: string): Promise<ResponseFineDto> {
    const fine = await this.fineRepository.findOne({ where: { id } });
    if (!fine) throw new NotFoundException(`Fine not found!`);
    if (fine.paid) throw new BadRequestException('Fine already paid!');

    fine.paid = true;
    fine.paid_at = new Date();

    const saveFine = await this.fineRepository.save(fine);

    return plainToInstance(ResponseFineDto, saveFine);
  }

  async getAllFine(): Promise<ResponseFineDto[]> {
    const fines = await this.fineRepository.find();
    return fines.map((fine) => plainToInstance(ResponseFineDto, fine));
  }

  async getFineById(id: string): Promise<ResponseFineDto> {
    const fine = await this.fineRepository.findOne({ where: { id } });
    if (!fine) throw new NotFoundException(`Fine not found!`);

    return plainToInstance(ResponseFineDto, fine);
  }

  async getFineByUser(userId: string): Promise<ResponseFineDto[]> {
    const fines = await this.fineRepository.find({
      where: { user: { id: userId } },
    });

    return fines.map((fine) => plainToInstance(ResponseFineDto, fine));
  }

  async getFineByLoan(loanId: string): Promise<ResponseFineDto[]> {
    const fines = await this.fineRepository.find({
      where: { loan: { id: loanId } },
    });

    return fines.map((fine) => plainToInstance(ResponseFineDto, fine));
  }
}
