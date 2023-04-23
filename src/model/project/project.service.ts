import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { ProjectCreateDto, ProjectUpdateDto } from './dto';
import * as moment from 'moment';
@Injectable()
export class ProjectService {
  constructor(private prisma: PrismaService) {}

  async create(body: ProjectCreateDto) {
    const { skills, members, ...data } = body;
    await this.prisma.project.create({
      data: {
        ...data,
        leader: {
          connect: {
            username:
              members[members.findIndex(({ leader }) => leader)].username ||
              members[0].username,
          },
        },
        members: {
          connect: members.map(({ username }) => ({ username })),
        },
        skills: { connect: skills.map((id) => ({ id })) },
      },
    });
    return SUCCESS_RESPONSE;
  }

  async update(body: ProjectUpdateDto) {
    const { id, members, skills, ...data } = body;
    await this.prisma.project.update({
      where: { id },
      data: {
        ...data,
        leader: {
          connect: {
            username:
              members[members.findIndex(({ leader }) => leader)].username ||
              members[0].username,
          },
        },
        members: {
          connect: members.map(({ username }) => ({ username })),
        },
        skills: { connect: skills.map((id) => ({ id })) },
      },
    });
    return SUCCESS_RESPONSE;
  }

  async getOne(id: number) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        skills: true,
        leader: { select: { avatar: true, name: true, username: true } },
        members: { select: { avatar: true, name: true, username: true } },
      },
    });
    return project;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    page--;
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

  async getAllByUsername(username: string) {
    const projects = await this.prisma.project.findMany({
      where: {
        OR: [{ leaderUsername: username }, { members: { some: { username } } }],
      },
      include: {
        skills: true,
        leader: { select: { avatar: true, name: true, username: true } },
        members: { select: { avatar: true, name: true, username: true } },
      },
      orderBy: { startAt: 'desc' },
    });
    return projects;
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
      const projectCount = await this.prisma.project.count({
        where: {
          OR: [
            {
              finishAt: {
                gte: startDate.toDate(),
                lte: lastDate.toDate(),
              },
            },
            {
              startAt: {
                lte: lastDate.toDate(),
              },
              finishAt: null,
            },
            {
              startAt: {
                lte: lastDate.toDate(),
              },
              finishAt: {
                gte: startDate.toDate(),
              },
            },
          ],
        },
      });
      data.push(projectCount);
    }
    return data;
  }
}
