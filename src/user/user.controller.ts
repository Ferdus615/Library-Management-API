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
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: 'Register a new user',
    description:
      'Creates a new user record. Emails must be unique across the system.',
  })
  @ApiResponse({
    status: 201,
    description: 'User created successfully.',
    type: ResponseUserDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Validation failed or email exists.',
  })
  async createUser(@Body() dto: CreateUserDto): Promise<ResponseUserDto> {
    const user = await this.userService.createUser(dto);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
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
    const users = await this.userService.findAllUser();
    return plainToInstance(ResponseUserDto, users, {
      excludeExtraneousValues: true,
    });
  }

  @Get('names')
  @ApiOperation({ summary: 'Search users by name' })
  @ApiQuery({
    name: 'name',
    description: 'Partial or full name search string',
    example: 'John',
  })
  @ApiResponse({ status: 200, type: [ResponseUserDto] })
  async findByName(@Query('name') name: string): Promise<ResponseUserDto[]> {
    const user = await this.userService.findByName(name);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('phones')
  @ApiOperation({ summary: 'Search user by phone number' })
  @ApiQuery({
    name: 'phone',
    description: 'The exact phone number of the user',
    example: '01711223344',
  })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findByPhone(@Query('phone') phone: string): Promise<ResponseUserDto> {
    const user = await this.userService.findByPhone(phone);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'id', description: 'User UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseUserDto> {
    const user = await this.userService.findOneUser(id);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
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
    const user = await this.userService.findByEmail(email);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
  }

  @Get('loans/:id')
  async findUserLoan(@Param('id') id: string): Promise<ResponseLoanDto[]> {
    const loans = await this.userService.findUserLoan(id);

    return plainToInstance(ResponseLoanDto, loans, {
      excludeExtraneousValues: true,
    });
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
    const user = await this.userService.updateUser(id, dto);
    return plainToInstance(ResponseUserDto, user, {
      excludeExtraneousValues: true,
    });
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
