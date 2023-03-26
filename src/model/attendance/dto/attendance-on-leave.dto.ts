import { Transform } from 'class-transformer';
import { IsDate } from 'class-validator';
import { toDate } from 'src/helpers';
import { ATTENDANCE_STATUS } from '../constants';
import { IsAttendanceStatus } from '../decorator';

export class AttendanceOnLeaveDto {
  @IsAttendanceStatus()
  status: typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];

  @Transform(({ value }) => toDate(value))
  @IsDate()
  date: Date;
}
