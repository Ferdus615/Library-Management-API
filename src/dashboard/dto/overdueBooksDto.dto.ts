import { Expose, Type } from 'class-transformer';
import { BookOverdueDto } from './bookOverdueDto.dto';
import { UserOverdueDto } from './userOverdueDto.dto';

export class OverdueBooksDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => BookOverdueDto)
  book: BookOverdueDto;

  @Expose()
  @Type(() => UserOverdueDto)
  user: UserOverdueDto;

  @Expose()
  due_date: string;

  @Expose()
  issue_date: string;
}
