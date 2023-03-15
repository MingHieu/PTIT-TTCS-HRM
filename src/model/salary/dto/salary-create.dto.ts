import { toInt } from 'src/helpers';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class SalaryCreateDto {
  @Transform(({ value }) => toInt(value))
  @IsInt()
  value: number;

  @IsString()
  @IsOptional()
  note?: string;
}
