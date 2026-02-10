import { Expose } from 'class-transformer';

export class OverdueBooksDto {
  @Expose()
  book: string;

  @Expose()
  user: string;

  @Expose()
  dueDate: Date;

  @Expose()
  issuedDate: Date;

  @Expose()
  fine: number;
}
