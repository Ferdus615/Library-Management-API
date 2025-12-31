import { Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { Loan } from 'src/loan/entities/loan.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Book, Loan])],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
