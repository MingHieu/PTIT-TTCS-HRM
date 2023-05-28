import { Injectable } from '@nestjs/common';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { SETTING } from './constants';

@Injectable()
export class SettingService {
  constructor(private prisma: PrismaService) {}

  async update(
    name: typeof SETTING[keyof typeof SETTING]['name'],
    value: string,
  ) {
    await this.prisma.setting.update({ where: { name }, data: { value } });
    return SUCCESS_RESPONSE;
  }

  async getOne(name: typeof SETTING[keyof typeof SETTING]['name']) {
    const setting = await this.prisma.setting.findUnique({ where: { name } });
    return setting;
  }

  async getAll() {
    const settings = await this.prisma.setting.findMany();
    return settings;
  }
}
