import { Body, Controller, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { AttendanceService } from './attendance.service';
import { AttendanceUpsertDto } from './dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check')
  checkIn(
    @Body() body: AttendanceUpsertDto,
    @GetUser('username') username: string,
  ) {
    return this.attendanceService.upsert(body, username);
  }
}
