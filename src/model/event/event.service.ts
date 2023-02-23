import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async getMany(page: number, take: number, keySearch: string) {
    console.log(keySearch);
    const events = await this.prisma.event.findMany({
      where: { name: { contains: keySearch } },
      skip: page * take,
      take,
      include: { participants: true },
    });
    const totalEvent = await this.prisma.event.count();
    return {
      data: events,
      page,
      per_page: take,
      page_size: events.length,
      total: totalEvent,
    };
  }
}
