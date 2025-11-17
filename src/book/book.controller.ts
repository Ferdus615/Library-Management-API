import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseBookDto } from './dto/responseBookDto.dto';

@ApiTags('book')
@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new book record' })
  @ApiResponse({
    status: 201,
    description: 'The book has been successfully created.',
    type: ResponseBookDto, // Or a specific Response DTO
  })
  async createBook(
    @Body() createBookDto: CreateBookDto,
  ): Promise<ResponseBookDto | ResponseBookDto[]> {
    return await this.bookService.createBook(createBookDto);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all books' })
  @ApiResponse({
    status: 200,
    description: 'Return all books.',
    type: [ResponseBookDto],
  })
  async findAllBook(): Promise<ResponseBookDto[]> {
    return await this.bookService.findAllBook();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single book by ID' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the book',
    type: 'string',
  })
  @ApiResponse({ status: 200, description: 'Return the requested book.' })
  @ApiResponse({ status: 404, description: 'Book not found.' })
  async findOneBook(@Param('id') id: string): Promise<ResponseBookDto> {
    return await this.bookService.findOneBook(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an existing book record' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the book to update',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully updated.',
  })
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ): Promise<ResponseBookDto> {
    return await this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a book record' })
  @ApiParam({
    name: 'id',
    description: 'The unique ID of the book to delete',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'The book has been successfully deleted.',
  })
  removeBook(@Param('id') id: string) {
    return this.bookService.removeBook(id);
  }
}
