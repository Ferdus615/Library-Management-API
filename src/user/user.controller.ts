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
import { ApiOperation, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
    description: 'Registers a new user in the library system.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation failed or Email already exists.',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    return await this.userService.createUser(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieves a list of all registered users.',
  })
  @ApiResponse({
    status: 200,
    description: 'List of users retrieved.',
    type: [ResponseUserDto],
  })
  async findAllUser(): Promise<ResponseUserDto[]> {
    return await this.userService.findAllUser();
  }

  @Get('names')
  @ApiOperation({
    summary: 'Find users by name',
    description: 'Search users using a partial name query.',
  })
  @ApiQuery({ name: 'name', required: true, example: 'John' })
  @ApiResponse({
    status: 200,
    description: 'Matching users found.',
    type: [ResponseUserDto],
  })
  async findByName(@Query('name') name: string): Promise<ResponseUserDto[]> {
    return await this.userService.findByName(name);
  }

  @Get('phones')
  @ApiOperation({
    summary: 'Find user by phone',
    description: 'Fetch a single user using their phone number.',
  })
  @ApiQuery({ name: 'phone', required: true, example: '01711223344' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByPhone(@Query('phone') phone: string): Promise<ResponseUserDto> {
    return await this.userService.findByPhone(phone);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
    description: 'Fetches detailed user information by their UUID.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseUserDto> {
    return await this.userService.findOneUser(id);
  }

  @Get('email/:email')
  @ApiOperation({
    summary: 'Find user by email',
    description: 'Fetch a single user using their email address.',
  })
  @ApiParam({ name: 'email', example: 'john@example.com' })
  @ApiResponse({
    status: 200,
    description: 'User found.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByEmail(@Param('email') email: string): Promise<ResponseUserDto> {
    return await this.userService.findByEmail(email);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update user',
    description: 'Updates specific fields of an existing user.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully.',
    type: ResponseUserDto,
  })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return await this.userService.updateUser(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete user',
    description: 'Removes a user from the system permanently.',
  })
  @ApiParam({ name: 'id', description: 'The UUID of the user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async removeUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.userService.removeUser(id);
  }
}
