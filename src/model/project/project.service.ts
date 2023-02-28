import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ProjectCreateDto, ProjectUpdateDto } from './dto';
import * as moment from 'moment';
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(body: ProjectCreateDto) {
    const { skillId, membersUsername, ...data } = body;
    await this.prisma.project.create({
      data: {
        ...data,
        members: { connect: membersUsername.map((username) => ({ username })) },
        skills: { connect: skillId.map((id) => ({ id })) },
      },
    });
    return SUCCESS_RESPONSE;
  }

  async update(body: ProjectUpdateDto) {
    const { id, membersUsername, skillId, ...data } = body;
    await this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        members: { connect: membersUsername.map((username) => ({ username })) },
        skills: { connect: skillId.map((id) => ({ id })) },
      },
    });
    return SUCCESS_RESPONSE;
  }

  async getOne(id: number) {
    const project = await this.prisma.project.findFirst({ where: { id } });
    return project;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    console.log(keySearch);
    const projects = await this.prisma.project.findMany({
      where: { name: { contains: keySearch } },
      skip: page * perPage,
      take: perPage,
      include: {
        skills: true,
      },
      orderBy: { startAt: 'desc' },
    });
    const totalProjects = await this.prisma.project.count();
    return {
      data: projects,
      page,
      per_page: perPage,
      page_size: projects.length,
      total: totalProjects,
    };
  }

  async delete(id: number) {
    await this.prisma.project.delete({ where: { id } });
    return SUCCESS_RESPONSE;
  }

  async statistic() {
    const data = [];
    const date = new Date();
    for (let i = 1; i <= date.getMonth() + 1; ++i) {
      const startDate = moment([date.getFullYear(), i - 1]);
      const lastDate = moment(startDate).endOf('month');
      const userCount = await this.prisma.project.count({
        where: {
          finishAt: {
            lte: lastDate.toDate(),
          },
        },
      });
      data.push(userCount);
    }
    return data;
  }
}
