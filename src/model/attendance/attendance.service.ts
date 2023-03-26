import { SettingService } from 'src/model/setting/setting.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AttendanceExportDto, AttendanceOnLeaveDto } from './dto';
import { SETTING } from 'src/model/setting/constants';
import { ATTENDANCE_STATUS } from './constants';
import { SUCCESS_RESPONSE } from 'src/common/constants';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService, private setting: SettingService) {}

  async getCheckInStatus(
    time: Date,
  ): Promise<typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS]> {
    const companyCheckInTime = await this.setting.getOne(SETTING.CHECK_IN.name);
    const [companyCheckInHours, companyCheckInMinutes] =
      companyCheckInTime.value.split(':').map((val) => +val);
    const checkInHours = time.getHours();
    const checkInMinutes = time.getMinutes();

    if (
      checkInHours > companyCheckInHours ||
      (checkInHours == companyCheckInHours &&
        checkInMinutes > companyCheckInMinutes)
    ) {
      return ATTENDANCE_STATUS.late;
    }
    return ATTENDANCE_STATUS.ontime;
  }

  async checkIn(username: string) {
    const time = new Date();
    await this.prisma.attendance.upsert({
      where: {
        username_date: {
          username,
          date: time,
        },
      },
      update: { checkOut: time },
      create: {
        username,
        date: time,
        status: await this.getCheckInStatus(time),
        checkIn: time,
      },
    });
    return SUCCESS_RESPONSE;
  }

  async onLeave(username: string, body: AttendanceOnLeaveDto) {
    await this.prisma.attendance.create({
      data: { ...body, username },
    });
    return SUCCESS_RESPONSE;
  }

  async getOne(username: string, date: Date) {
    const attendance = await this.prisma.attendance.findUnique({
      where: {
        username_date: {
          username,
          date,
        },
      },
    });
    return attendance;
  }

  async getManyByUsername(username: string, page?: number, perPage?: number) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    page--;
    const attendances = await this.prisma.attendance.findMany({
      where: { username },
      skip: page * perPage,
      take: perPage,
      orderBy: { date: 'desc' },
    });
    const totalAttendances = await this.prisma.attendance.count();
    return {
      data: attendances,
      page,
      per_page: perPage,
      page_size: attendances.length,
      total: totalAttendances,
    };
  }

  async getAllByFromTo(body: AttendanceExportDto) {
    const users = await this.prisma.user.findMany({
      select: {
        name: true,
        username: true,
        attendances: {
          where: {
            date: { gte: body.from, lte: body.to },
          },
        },
      },
    });

    const normalizeAttendance = users.map((value, index) => {
      return {
        STT: index + 1,
        'Họ và tên': value.name,
        'Tên đăng nhập': value.username,
        'Đúng giờ': value.attendances.filter(
          (value) => value.status === ATTENDANCE_STATUS.ontime,
        ).length,
        'Đi muộn': value.attendances.filter(
          (value) => value.status === ATTENDANCE_STATUS.late,
        ).length,
        'Nghỉ có phép': value.attendances.filter(
          (value) => value.status === ATTENDANCE_STATUS.onleave,
        ).length,
        'Nghỉ không phép': value.attendances.filter(
          (value) => value.status === ATTENDANCE_STATUS.unpaidleave,
        ).length,
      };
    });

    return normalizeAttendance;
  }
}
