import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { ResponseBookDto } from './dto/responseBookDto.dto';
import { ResponseLoanDto } from 'src/loan/dto/responseLoanDto.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { MemberStatus } from 'src/user/enum/member.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Public } from 'src/auth/decorators/public.decorators';
import { BookQueryDto } from './dto/bookQueryDto.dto';
import { ResponseReservationDto } from 'src/reservation/dto/responseReservationDto.dto';

@ApiTags('books')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Roles(MemberStatus.ADMIN)
  @UseGuards(RolesGuard)
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
    summary: 'Retrieve all books with optional search, filter, and pagination',
    description:
      'Returns a list of books available in the system. Supports searching by title, author, or ISBN, filtering by category, and pagination.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the list of books.',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: { $ref: '#/components/schemas/ResponseBookDto' },
        },
        total: { type: 'number' },
      },
    },
  })
  async findAllBook(@Query() query: BookQueryDto): Promise<{
    data: ResponseBookDto[];
    total: number;
  }> {
    return await this.bookService.findAllBook(query);
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

  @Roles(MemberStatus.ADMIN)
  @UseGuards(RolesGuard)
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

  @Roles(MemberStatus.ADMIN)
  @UseGuards(RolesGuard)
  @Get('reservations/:id')
  @ApiOperation({
    summary: 'Retrieve reservation history for a specific book',
    description:
      'Returns a list of all historical and active reservations associated with a specific book ID, including member details.',
  })
  @ApiParam({
    name: 'id',
    description: 'The unique UUID of the book',
    format: 'uuid',
    example: 'a1b2c3d4-e5f6-7890-abcd-ef0123456789',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved the reservation history.',
    type: [ResponseReservationDto],
  })
  @ApiResponse({
    status: 404,
    description: 'Book not found.',
  })
  async findBookReservations(
    @Param('id') id: string,
  ): Promise<ResponseReservationDto[]> {
    return await this.bookService.findBookReservations(id);
  }

  @Roles(MemberStatus.ADMIN)
  @UseGuards(RolesGuard)
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

  @Roles(MemberStatus.ADMIN)
  @UseGuards(RolesGuard)
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
