import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { SalaryCreateDto } from './dto';

@Injectable()
export class SalaryService {
  constructor(private prisma: PrismaService) {}

  async create(body: SalaryCreateDto) {
    await this.prisma.salary.create({
      data: { ...body },
    });
    return SUCCESS_RESPONSE;
  }

  async getAll(username: string) {
    const salaryHistory = await this.prisma.salary.findMany({
      where: { username },
    });
    return salaryHistory;
  }
}
