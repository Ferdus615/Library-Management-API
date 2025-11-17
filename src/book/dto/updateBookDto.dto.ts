import { IsString, IsNumber, MaxLength, Min } from 'class-validator';
export class UpdateBookDto {
  @IsString()
  @MaxLength(150)
  title?: string;

  @IsString()
  @MaxLength(100)
  author?: string;

  @IsNumber()
  @Min(1)
  copies_added?: number;

  @IsNumber()
  @Min(1)
  damaged_copies?: number;
}
