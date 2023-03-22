import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { SalaryCreateDto } from './dto';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async create(body: SalaryCreateDto, username: string) {
    await this.prisma.salary.create({
      data: { ...body, username },
    });
    return SUCCESS_RESPONSE;
  }

  async getAllByUsername(username: string) {
    const salaryHistory = await this.prisma.salary.findMany({
      where: { username },
      orderBy: { createAt: 'desc' },
    });
    return salaryHistory;
  }
}
