import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Fine } from './entities/fine.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { CreateFineDto } from './dto/createFineDto.dto';
import { ResponseFineDto } from './dto/responseFineDto.dto';
import { NotFoundError } from 'rxjs';

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
  }
}
