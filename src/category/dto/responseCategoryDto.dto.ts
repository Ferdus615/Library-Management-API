import { Expose } from 'class-transformer';

export class ResponseCategoryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description?: string;

  @Expose()
  created_at: Date;
}
