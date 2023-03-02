import { toInt, toDate } from 'src/helpers';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class SalaryCreateDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @Transform(({ value }) => toInt(value))
  @IsInt()
  value: number;

  @IsString()
  @IsOptional()
  note?: string;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  createAt: Date;
}
