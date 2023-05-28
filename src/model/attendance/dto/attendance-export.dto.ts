import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import { toDate } from 'src/helpers';

export class AttendanceExportDto {
  @Transform(({ value }) => toDate(value))
  @IsDate()
  from: Date;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  to: Date;
}
