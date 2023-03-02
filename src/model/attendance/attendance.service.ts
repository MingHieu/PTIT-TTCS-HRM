import { SettingService } from 'src/model/setting/setting.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AttendanceUpsertDto } from './dto';
import { SETTING } from 'src/model/setting/constants';
import { ATTENDANCE_STATUS } from './constants';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService, private setting: SettingService) {}

  async upsert(body: AttendanceUpsertDto, username: string) {
    const { id, checkIn, checkOut } = body;
    let status: typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
    if (!checkIn && !checkOut) {
      status = ATTENDANCE_STATUS.dayoff;
    } else if (checkIn) {
      const companyCheckInTime = await this.setting.getOne(SETTING.CHECK_IN);
      const [companyCheckInHours, companyCheckInMinutes] =
        companyCheckInTime.value.split(':');

      const checkInHours = checkIn.getHours();
      const checkInMinutes = checkIn.getMinutes();
      if (!checkIn && !checkOut) {
        status = ATTENDANCE_STATUS.dayoff;
      } else if (checkInHours > +companyCheckInHours) {
        status = ATTENDANCE_STATUS.late;
      } else if (
        checkInHours == +companyCheckInHours &&
        checkInMinutes > +companyCheckInMinutes
      ) {
        status = ATTENDANCE_STATUS.late;
      } else {
        status = ATTENDANCE_STATUS.ontime;
      }
    }

    await this.prisma.attendance.upsert({
      where: { id },
      update: { checkOut },
      create: { username, status, checkIn },
    });
  }

  async getMany(page: number, perPage: number, username: string) {
    const attendances = await this.prisma.attendance.findMany({
      where: { username },
      skip: page * perPage,
      take: perPage,
      orderBy: { createAt: 'desc' },
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
}
