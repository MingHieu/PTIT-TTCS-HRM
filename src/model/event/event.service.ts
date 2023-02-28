import { PrismaService } from 'src/database/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { EventCreateDto, EventUpdateDto } from './dto';

@Injectable()
export class EventService {
  constructor(private prisma: PrismaService) {}

  async create(body: EventCreateDto) {
    await this.prisma.event.create({
      data: { ...body },
    });
    return SUCCESS_RESPONSE;
  }

  async update(body: EventUpdateDto) {
    const { id, ...data } = body;
    await this.prisma.event.update({
      where: { id },
      data: { ...data },
    });
    return SUCCESS_RESPONSE;
  }

  async getOne(id: number) {
    const event = await this.prisma.event.findFirst({
      where: { id },
      include: {
        participants: { select: { name: true, username: true, avatar: true } },
      },
    });
    return event;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    console.log(keySearch);
    const events = await this.prisma.event.findMany({
      where: { name: { contains: keySearch } },
      skip: page * perPage,
      take: perPage,
      include: {
        participants: { select: { name: true, username: true, avatar: true } },
      },
      orderBy: { createAt: 'desc' },
    });
    const totalEvent = await this.prisma.event.count();
    return {
      data: events,
      page,
      per_page: perPage,
      page_size: events.length,
      total: totalEvent,
    };
  }

  async delete(id: number) {
    await this.prisma.event.delete({ where: { id } });
    return SUCCESS_RESPONSE;
  }
}
