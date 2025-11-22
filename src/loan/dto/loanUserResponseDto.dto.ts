import { Expose } from 'class-transformer';

export class LoanUserResponseDto {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  author: string;

  @Expose()
  isbn: string;
}
