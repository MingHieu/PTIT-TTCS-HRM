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
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        participants: { select: { name: true, username: true, avatar: true } },
      },
    });
    return event;
  }

  async getMany(page?: number, perPage?: number, keySearch?: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    page--;
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

  async getAllByUsername(username: string) {
    const events = await this.prisma.event.findMany({
      where: { participants: { some: { username } } },
      orderBy: { createAt: 'desc' },
      include: {
        participants: { select: { name: true, username: true, avatar: true } },
      },
    });
    return events;
  }

  async delete(id: number) {
    await this.prisma.event.delete({ where: { id } });
    return SUCCESS_RESPONSE;
  }

  async subscribe(id: number, username: string) {
    await this.prisma.event.update({
      where: { id },
      data: { participants: { connect: { username } } },
    });
    return SUCCESS_RESPONSE;
  }
}
