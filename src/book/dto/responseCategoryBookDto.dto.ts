import { Expose } from 'class-transformer';

export class ResponseBookCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}
