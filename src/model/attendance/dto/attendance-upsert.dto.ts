import { Transform } from 'class-transformer';
import { IsDate, IsInt, IsOptional } from 'class-validator';
import { toDate } from 'src/helpers';
export class AttendanceUpsertDto {
  @IsInt()
  @IsOptional()
  id?: number;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  checkIn: Date;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  @IsOptional()
  checkOut?: Date;
}
