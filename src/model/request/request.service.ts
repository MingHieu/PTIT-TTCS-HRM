import { REQUEST_STATUS } from './constants/request-status';
import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { RequestCreateDto, RequestUpdateDto } from './dto';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async create(body: RequestCreateDto) {
    await this.prisma.request.create({
      data: { ...body, status: REQUEST_STATUS.pending },
    });
    return SUCCESS_RESPONSE;
  }

  async update(body: RequestUpdateDto) {
    const { id, ...data } = body;
    const request = await this.prisma.request.update({
      where: { id },
      data: { ...data },
      include: {
        sender: { select: { name: true, username: true, avatar: true } },
      },
    });
    return request;
  }

  async getOne(id: number) {
    const event = await this.prisma.request.findFirst({
      where: { id },
      include: {
        sender: { select: { name: true, username: true, avatar: true } },
      },
    });
    return event;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    console.log(keySearch);
    const requests = await this.prisma.request.findMany({
      where: { name: { contains: keySearch } },
      skip: page * perPage,
      take: perPage,
      include: {
        sender: { select: { name: true, username: true, avatar: true } },
      },
      orderBy: { createAt: 'desc' },
    });
    const totalRequest = await this.prisma.request.count();
    return {
      data: requests,
      page,
      per_page: perPage,
      page_size: requests.length,
      total: totalRequest,
    };
  }

  async delete(id: number) {
    await this.prisma.request.delete({ where: { id } });
    return SUCCESS_RESPONSE;
  }
}
