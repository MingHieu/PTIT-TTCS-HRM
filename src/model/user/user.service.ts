import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(body: UserDto, username: string) {
    await this.prisma.user.update({
      where: { username },
      data: body,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
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
}
