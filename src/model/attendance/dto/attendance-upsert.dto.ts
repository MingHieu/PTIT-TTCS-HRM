import { IsBoolean, IsInt } from 'class-validator';
import { ATTENDANCE_STATUS } from '../constants';

export class AttendanceUpsertDto {
  @IsBoolean()
  checkIn?: boolean;

  @IsInt()
  status?: typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
}
