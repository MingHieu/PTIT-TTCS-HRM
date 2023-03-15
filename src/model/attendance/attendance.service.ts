import { SettingService } from 'src/model/setting/setting.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AttendanceUpsertDto } from './dto';
import { SETTING } from 'src/model/setting/constants';
import { ATTENDANCE_STATUS } from './constants';
import moment from 'moment';

@Injectable()
export class AttendanceService {
  constructor(private prisma: PrismaService, private setting: SettingService) {}

  async checkIn() {
    let status: typeof ATTENDANCE_STATUS[keyof typeof ATTENDANCE_STATUS];
    const time = new Date();

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
      status = ATTENDANCE_STATUS.late;
    } else {
      status = ATTENDANCE_STATUS.ontime;
    }

    return { status, checkIn: time };
  }

  async upsert(body: AttendanceUpsertDto, username: string) {
    const { checkIn, status } = body;

    if (checkIn) {
      await this.prisma.attendance.upsert({
        where: {
          username_date: {
            username,
            date: new Date(),
          },
        },
        update: { checkOut: new Date() },
        create: { username, ...(await this.checkIn()) },
      });
    }

    if (status) {
      await this.prisma.attendance.upsert({
        where: {
          username_date: {
            username,
            date: moment().format('YYYY-MM-DD'),
          },
        },
        update: { status },
        create: { username, status },
      });
    }
  }

  async getMany(page: number, perPage: number, username: string) {
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
}
