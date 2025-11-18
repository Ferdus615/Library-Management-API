import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ResponseUserDto } from './dto/responseUserDto';
import { UpdateBookDto } from 'src/book/dto/updateBookDto.dto';
import { UpdateUserDto } from './dto/updateUserDto.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<ResponseUserDto> {
    const hashedPass = await bcrypt.hash(dto.password, 10);

    const user = this.userRepository.create({
      ...dto,
      password: hashedPass,
    });

    const saveUser = await this.userRepository.save(user);
    return new ResponseUserDto(saveUser);
  }

  async findAllUser(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    return users.map((user) => new ResponseUserDto(user));
  }

  async findOneUser(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id:${id} not found!`);

    return new ResponseUserDto(user);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) throw new NotFoundException(`User with id:${id} not found!`);
  }
}
