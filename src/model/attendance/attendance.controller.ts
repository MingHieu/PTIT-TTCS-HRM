import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto';
import { AttendanceService } from './attendance.service';
import { AttendanceUpsertDto } from './dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check')
  checkInOrOut(
    @Body() body: AttendanceUpsertDto,
    @GetUser('username') username: string,
  ) {
    return this.attendanceService.upsert(body, username);
  }

  @Get('all')
  getMany(
    @GetUser('username') username: string,
    @Query() query: PaginationDto,
  ) {
    return this.attendanceService.getMany(query.page, query.per_page, username);
  }
}
