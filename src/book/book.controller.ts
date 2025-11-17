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

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post()
  async createBook(@Body() createBookDto: CreateBookDto) {
    return await this.bookService.createBook(createBookDto);
  }

  @Get()
  async findAllBook() {
    return await this.bookService.findAllBook();
  }

  @Get(':id')
  async findOneBook(@Param('id') id: string) {
    return await this.bookService.findOneBook(id);
  }

  @Patch(':id')
  async updateBook(
    @Param('id') id: string,
    @Body() updateBookDto: UpdateBookDto,
  ) {
    return await this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  removeBook(@Param('id') id: string) {
    return this.bookService.removeBook(id);
  }
}
