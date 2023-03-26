import { SettingService } from 'src/model/setting/setting.service';
import { FileService } from 'src/model/file/file.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserCreateDto, UserUpdateDto } from './dto';
import * as argon from 'argon2';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import * as moment from 'moment';
@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
    private setting: SettingService,
  ) {}

  async create(body: UserCreateDto, avatar?: File) {
    const username = this.getUsername(body.name);
    const usernameExistNumber = await this.prisma.user.count({
      where: { username },
    });
    const hashPassword = await argon.hash('12345678');

    if (avatar) {
      const uploadedFile = await this.fileService.create(avatar);
      Object.assign(body, { avatar: uploadedFile.url });
    }

    const dayOffRemain = await this.setting.getOne('day_off_numbers');

    const user = await this.prisma.user.create({
      data: {
        ...body,
        username:
          usernameExistNumber > 0
            ? username + (usernameExistNumber + 1)
            : username,
        password: hashPassword,
        dayOffRemain: +dayOffRemain.value,
      },
    });
    delete user.password;
    return user;
  }

  async update(
    username: string,
    body: UserCreateDto | UserUpdateDto,
    avatar?: File,
  ) {
    if (avatar) {
      const uploadedFile = await this.fileService.create(avatar);
      Object.assign(body, { avatar: uploadedFile.url });
    }
    const user = await this.prisma.user.update({
      where: { username },
      data: body,
    });
    delete user.password;
    return user;
  }

  async getOne(username: string) {
    const user = await this.prisma.user.findUnique({
      where: { username },
    });
    delete user.password;
    return user;
  }

  async getMany(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    page--;
    const users = await this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: keySearch } },
          { username: { contains: keySearch } },
        ],
      },
      skip: page * perPage,
      take: perPage,
      select: {
        id: true,
        avatar: true,
        name: true,
        joinAt: true,
        role: true,
        username: true,
        email: true,
        dob: true,
        sex: true,
        phoneNumber: true,
        address: true,
      },
      orderBy: { createAt: 'desc' },
    });
    const totalUsers = await this.prisma.user.count();
    return {
      data: users,
      page,
      per_page: perPage,
      page_size: users.length,
      total: totalUsers,
    };
  }

  async delete(username: string) {
    await this.prisma.user.delete({ where: { username } });
    return SUCCESS_RESPONSE;
  }

  async statistic() {
    const data = [];
    const date = new Date();
    for (let i = 1; i <= date.getMonth() + 1; ++i) {
      const startDate = moment([date.getFullYear(), i - 1]);
      const lastDate = moment(startDate).endOf('month');
      const userCount = await this.prisma.user.count({
        where: {
          joinAt: {
            gte: startDate.toDate(),
            lte: lastDate.toDate(),
          },
        },
      });
      data.push(userCount);
    }
    return data;
  }

  getUsername(name: string) {
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const nameStrings = name.split(' ');
    let username = nameStrings[nameStrings.length - 1];
    for (let i = 0; i < nameStrings.length - 1; ++i) {
      username += nameStrings[i][0];
    }
    return username.toLowerCase();
  }
}
