import { Controller, Post, Get, Query } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { PaginationDto } from 'src/common/dto';
import { AttendanceService } from './attendance.service';

@Controller('attendance')
export class AttendanceController {
  constructor(private attendanceService: AttendanceService) {}

  @Post('check')
  checkIn(@GetUser('username') username: string) {
    return this.attendanceService.checkIn(username);
  }

  @Get()
  getMany(@Query() query: PaginationDto, @GetUser('username') username) {
    return this.attendanceService.getManyByUsername(
      username,
      query.page,
      query.per_page,
    );
  }
}
