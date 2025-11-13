import { Injectable } from '@nestjs/common';
import { CreateBookDto } from './dto/createBookDto.dto';
import { UpdateBookDto } from './dto/updateBookDto.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { ResponseBookDto } from './dto/responseBookDto.dto';


@Injectable()
export class BookService {
  constructor(@InjectRepository(Book)
  private readonly bookRepository: Repository<Book>) {}

  async create(createBookDto: CreateBookDto): Promise<ResponseBookDto> {
    const 
  }

  async findAll() {
    return `This action returns all book`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} book`;
  }

  async update(id: number, updateBookDto: UpdateBookDto) {
    return `This action updates a #${id} book`;
  }

  async remove(id: number) {
    return `This action removes a #${id} book`;
  }
}
