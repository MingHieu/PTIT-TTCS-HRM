import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { NotificationCreateDto } from './dto';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async create(body: NotificationCreateDto) {
    await this.prisma.notification.create({
      data: {
        ...body,
      },
    });
    return SUCCESS_RESPONSE;
  }

  async getOne(id: number) {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    });
    return notification;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    page--;
    const notifications = await this.prisma.notification.findMany({
      where: {
        OR: [
          { name: { contains: keySearch } },
          { content: { contains: keySearch } },
        ],
      },
      skip: page * perPage,
      take: perPage,
      orderBy: { createAt: 'desc' },
    });
    const totalNotifications = await this.prisma.notification.count();
    return {
      data: notifications,
      page,
      per_page: perPage,
      page_size: notifications.length,
      total: totalNotifications,
    };
  }

  async delete(id: number) {
    await this.prisma.notification.delete({ where: { id } });
    return SUCCESS_RESPONSE;
  }
}
