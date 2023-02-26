import { FileService } from 'src/model/file/file.service';
import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserCreateDto } from './dto';
import * as argon from 'argon2';
import { SUCCESS_RESPONSE } from 'src/common/constants';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private fileService: FileService,
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

    const user = await this.prisma.user.create({
      data: {
        ...body,
        username:
          usernameExistNumber > 0
            ? username + (usernameExistNumber + 1)
            : username,
        password: hashPassword,
      },
    });
    delete user.password;
    return user;
  }

  async update(username: string, body: UserCreateDto, avatar?: File) {
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
    const user = await this.prisma.user.findFirst({
      where: { username },
    });
    delete user.password;
    return user;
  }

  async getMany(page: number, take: number, keySearch: string) {
    console.log(keySearch);
    const users = await this.prisma.user.findMany({
      where: {
        OR: {
          name: { contains: keySearch },
          username: { contains: keySearch },
        },
      },
      skip: page * take,
      take,
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
      per_page: take,
      page_size: users.length,
      total: totalUsers,
    };
  }

  async delete(username: string) {
    await this.prisma.user.delete({ where: { username } });
    return SUCCESS_RESPONSE;
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
