import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ResponseUserDto } from './dto/responseUserDto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from './entities/user.entity';
import { Loan } from 'src/loan/entities/loan.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Loan) private readonly loanRepository: Repository<Loan>,
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<ResponseUserDto> {
    const hashedPass = await bcrypt.hash(dto.password, 10);

    const findUser = this.userRepository.create({
      ...dto,
      password: hashedPass,
    });

    const savedUser = await this.userRepository.save(findUser);
    return plainToInstance(ResponseUserDto, savedUser, {
      excludeExtraneousValues: true,
    });
  }

  async findAllUser(): Promise<ResponseUserDto[]> {
    const findUsers = await this.userRepository.find();
    return findUsers.map((user) =>
      plainToInstance(ResponseUserDto, user, { excludeExtraneousValues: true }),
    );
  }

  async findOneUser(id: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with id:${id} not found!`);

    return plainToInstance(ResponseUserDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async findByEmail(email: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser) {
      throw new NotFoundException(`User with email:${email} not found!`);
    }

    return plainToInstance(ResponseUserDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async findByName(name: string): Promise<ResponseUserDto[]> {
    const findUsers = await this.userRepository.find({
      where: [
        {
          first_name: ILike(`%${name}%`),
        },
        { last_name: ILike(`%${name}%`) },
      ],
    });

    if (!findUsers || findUsers.length === 0) {
      throw new NotFoundException(`User not found!`);
    }

    return findUsers.map((user) =>
      plainToInstance(ResponseUserDto, user, { excludeExtraneousValues: true }),
    );
  }

  async findByPhone(phone: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { phone } });
    if (!findUser) throw new NotFoundException(`User not found!`);

    return plainToInstance(ResponseUserDto, findUser, {
      excludeExtraneousValues: true,
    });
  }

  async findUserLoan(id: string): Promise<ResponseLoanDto[]> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with od:${id} not found!`);

    const findLoans = await this.loanRepository.find({
      where: { user: { id } },
      relations: ['book'],
      order: { issue_date: 'DESC' },
    });

    return plainToInstance(ResponseLoanDto, findLoans, {
      excludeExtraneousValues: true,
    });
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with id:${id} not found!`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(findUser, dto);
    const result = await this.userRepository.save(findUser);
    return plainToInstance(ResponseUserDto, result, {
      excludeExtraneousValues: true,
    });
  }

  async removeUser(id: string) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with id:${id} not found!`);

    await this.userRepository.remove(findUser);
    return { message: `User has been successfully removed!` };
  }

  async findUserByEmailWithPassword(email: string): Promise<User | null> {
    const userWithPassword = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
    if (!userWithPassword) return null;

    return userWithPassword;
  }
}
