import { Expose } from 'class-transformer';

export class BookCategoryResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
