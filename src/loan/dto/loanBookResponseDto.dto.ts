import { Expose } from 'class-transformer';

export class LoanBookResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  author: string;

  @Expose()
  isbn: string;
}
