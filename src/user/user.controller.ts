import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/createUserDto.dto';
import { ResponseUserDto } from './dto/responseUserDto';
import { UpdateUserDto } from './dto/updateUserDto.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    return await this.userService.createUser(dto);
  }

  @Get()
  async findAllUser(): Promise<ResponseUserDto[]> {
    return await this.userService.findAllUser();
  }

  @Get('names')
  async findByName(@Query('name') name: string): Promise<ResponseUserDto[]> {
    return await this.userService.findByName(name);
  }

  @Get('phones')
  async findByPhone(@Query('phone') phone: string): Promise<ResponseUserDto> {
    return await this.userService.findByPhone(phone);
  }

  @Get(':id')
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseUserDto> {
    return await this.userService.findOneUser(id);
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<ResponseUserDto> {
    return await this.userService.findByEmail(email);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return await this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  async removeUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.userService.removeUser(id);
  }
}
