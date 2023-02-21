import { HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async update(body: UserDto, userId: number) {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: body,
    });
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Success',
    };
  }

  async getOne(userId: number) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: userId,
      },
    });
    delete user.password;
    return user;
  }
}
