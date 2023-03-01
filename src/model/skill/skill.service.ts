import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const requests = await this.prisma.skill.findMany();
    return requests;
  }
}
