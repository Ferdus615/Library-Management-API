import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class ResponseCategoryDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsOptional()
  descripiton?: string;

  @Expose()
  created_at: Date;
}
