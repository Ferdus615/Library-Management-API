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
  UseGuards,
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
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { MemberStatus } from './enum/member.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorators';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
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
    return await this.userService.createUser(dto);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
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

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @Get('names')
  @ApiOperation({ summary: 'Search users by name' })
  @ApiQuery({
    name: 'name',
    description: 'Partial or full name search string',
    example: 'John',
  })
  @ApiResponse({ status: 200, type: [ResponseUserDto] })
  async findByName(@Query('name') name: string): Promise<ResponseUserDto[]> {
    return await this.userService.findByName(name);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
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
    return await this.userService.findByPhone(phone);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get user details',
    description: 'Fetch any one users full details.',
  })
  @ApiParam({ name: 'id', description: 'User UUID', format: 'uuid' })
  @ApiResponse({ status: 200, type: ResponseUserDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ResponseUserDto> {
    return await this.userService.findOneUser(id);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
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

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
  @Get('loans/:id')
  @ApiOperation({
    summary: 'Find user loan(s)',
    description: 'Fetch a users all loans information.',
  })
  @ApiParam({ name: 'id', example: 'The UUID of the user' })
  @ApiResponse({
    status: 200,
    description: 'Loans found successfully',
    type: ResponseLoanDto,
  })
  @ApiResponse({ status: 404, description: 'Loans not found' })
  async findUserLoan(@Param('id') id: string): Promise<ResponseLoanDto[]> {
    return await this.userService.findUserLoan(id);
  }

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
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

  @UseGuards(RolesGuard)
  @Roles(MemberStatus.ADMIN, MemberStatus.LIBRARIAN)
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
    return await this.userService.removeUser(id);
  }
}
