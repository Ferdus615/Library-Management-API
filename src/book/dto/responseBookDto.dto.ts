import { Book } from '../entities/book.entity';

export class ResponseBookDto {
  id: string;

  isbn: string;

  title: string;

  author: string;

  publlication_year: number;

  total_copies: number;

  available_copies: number;

  constructor(book: Book) {
    this.id = book.id;
    this.isbn = book.isbn;
    this.title = book.title;
    this.author = book.author;
    this.publlication_year = book.publication_year;
    this.total_copies = book.total_copies;
    this.available_copies = book.available_copies;
  }
}
