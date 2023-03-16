import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto';
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
