import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Injectable()
export class SkillService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const skills = await this.prisma.skill.findMany();
    return skills;
  }
}
