import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => +value)
  @IsInt()
  @IsOptional()
  page?: number;

  @Transform(({ value }) => +value)
  @IsInt()
  @IsOptional()
  per_page?: number;

  @IsString()
  @IsOptional()
  key_search?: string;
}
