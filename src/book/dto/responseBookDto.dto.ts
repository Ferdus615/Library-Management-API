import { Books } from '../entities/book.entity';

export class ResponseBookDto {
  id: string;

  isbn: string;

  title: string;

  author: string;

  publication_year: number;

  total_copies: number;

  damaged_copies: number;

  available_copies: number;

  constructor(book: Books) {
    this.id = book.id;
    this.isbn = book.isbn;
    this.title = book.title;
    this.author = book.author;
    this.publication_year = book.publication_year;
    this.total_copies = book.total_copies;
    this.damaged_copies = book.damaged_copies;
    this.available_copies = book.available_copies;
  }
}
