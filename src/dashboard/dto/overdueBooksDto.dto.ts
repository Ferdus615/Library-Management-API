import { Expose, Type } from 'class-transformer';
import { BookOverdueDto } from './bookOverdueDto.dto';
import { UserOverdueDto } from './userOverdueDto.dto';

export class OverdueBooksDto {
  @Expose()
  @Type(() => BookOverdueDto)
  book: BookOverdueDto;

  @Expose()
  @Type(() => UserOverdueDto)
  user: UserOverdueDto;
}
