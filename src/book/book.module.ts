import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { Book } from './entities/book.entity';
import { Loan } from 'src/loan/entities/loan.entity';
import { Category } from 'src/category/entities/category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Loan, Category])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
