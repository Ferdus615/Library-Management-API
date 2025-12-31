import { Injectable, NotFoundException, Res } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ResponseUserDto } from './dto/responseUserDto';
import { UpdateUserDto } from './dto/updateUserDto.dto';
import { plainToClass, plainToInstance } from 'class-transformer';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<ResponseUserDto> {
    const hashedPass = await bcrypt.hash(dto.password, 10);

    const findUser = this.userRepository.create({
      ...dto,
      password: hashedPass,
    });

    const savedUser = await this.userRepository.save(findUser);
    return plainToInstance(ResponseUserDto, savedUser);
  }

  async findAllUser(): Promise<ResponseUserDto[]> {
    const findUsers = await this.userRepository.find();
    return findUsers.map((user) => plainToInstance(ResponseUserDto, user));
  }

  async findOneUser(id: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with id:${id} not found!`);

    return plainToInstance(ResponseUserDto, findUser);
  }

  async findByEmail(email: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { email } });
    if (!findUser) {
      throw new NotFoundException(`User with email:${email} not found!`);
    }

    return plainToInstance(ResponseUserDto, findUser);
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

    return findUsers.map((user) => plainToInstance(ResponseUserDto, user));
  }

  async findByPhone(phone: string): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { phone } });
    if (!findUser) throw new NotFoundException(`User not found!`);

    return plainToInstance(ResponseUserDto, findUser);
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<ResponseUserDto> {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with id:${id} not found!`);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 10);
    }

    Object.assign(findUser, dto);
    const result = await this.userRepository.save(findUser);
    return plainToInstance(ResponseUserDto, result);
  }

  async removeUser(id: string) {
    const findUser = await this.userRepository.findOne({ where: { id } });
    if (!findUser) throw new NotFoundException(`User with id:${id} not found!`);

    await this.userRepository.remove(findUser);
    return { message: `User has been successfully removed!` };
  }
}
