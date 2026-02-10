import { Expose } from 'class-transformer';

export class BookOverdueDto {
  @Expose()
  id: string;

  @Expose()
  title: string;
}
