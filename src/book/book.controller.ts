import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { ResponseBookDto } from './dto/responseBookDto.dto';
import { plainToInstance } from 'class-transformer';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorators';

@ApiTags('books')
@ApiBearerAuth()
@Roles(MemberStatus.ADMIN)
@UseGuards(RolesGuard)
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new book record',
    description:
      'Adds a new book to the library catalog with initial stock levels.',
  })
  @ApiResponse({
    status: 201,
    description: 'The book record has been successfully created.',
    type: ResponseBookDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data.' })
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<ResponseBookDto | ResponseBookDto[]> {
    return await this.bookService.createBook(createBookDto);
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Retrieve all books',
    description:
      'Returns a list of all books available in the system including their current availability status.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of books.',
    type: [ResponseBookDto],
  })
  async findAllBook(): Promise<ResponseBookDto[]> {
    return await this.bookService.findAllBook();
  }

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Retrieve a single book by ID',
    description:
      'Fetches detailed information for a specific book using its unique UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the book record',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Book found and returned.',
    type: ResponseBookDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No book found with the provided ID.',
  })
  async findOneBook(@Param('id') id: string): Promise<ResponseBookDto> {
    return await this.bookService.findOneBook(id);
  }

  @Get('loans/:id')
  @ApiOperation({
    summary: 'Retrieve loan history for a specific book',
    description:
      'Returns a list of all historical and active loans associated with a specific book ID, including member details.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the book',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the loan history.',
    type: [ResponseLoanDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found.',
  })
  async findBookLoans(@Param('id') id: string): Promise<ResponseLoanDto[]> {
    return await this.bookService.findBookLoans(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update an existing book record',
    description:
      'Updates specific fields of a book, such as title, author, or tracking damaged copies.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the book to update',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'The book record has been successfully updated.',
    type: ResponseBookDto,
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    return await this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a book record',
    description: 'Permanently removes a book record from the system.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the book to delete',
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'The book record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async removeBook(@Param('id') id: string) {
    return await this.bookService.removeBook(id);
  }
}
