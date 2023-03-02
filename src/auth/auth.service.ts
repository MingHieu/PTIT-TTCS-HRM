import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon from 'argon2';
import { SUCCESS_RESPONSE } from 'src/common/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserCreateDto } from 'src/model/user/dto';
import { UserService } from 'src/model/user/user.service';
import { IJwtPayload, LoginDto, ChangePasswordDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(body: UserCreateDto) {
    const user = await this.userService.create(body);
    const permissions = await this.prisma.permission.findMany({
      where: { role: user.role },
      select: { name: true },
    });
    const userWithToken = await this.prisma.user.update({
      where: { username: user.username },
      data: {
        token: this.signToken(
          user.id,
          user.username,
          permissions.map((p) => p.name),
        ),
      },
    });
    delete userWithToken.password;
    return userWithToken;
  }

  async login(props: LoginDto) {
    const { username, password } = props;

    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) throw new ForbiddenException('Tài khoản không tồn tại');

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('Sai mật khẩu');

    const permissions = await this.prisma.permission.findMany({
      where: { role: user.role },
      select: { name: true },
    });

    try {
      this.jwtService.verify(user.token, {
        secret: this.config.get('JWT_SECRET'),
      });
      delete user.password;
      return user;
    } catch (error) {
      // Token is expired or invalid
      const userWithNewToken = await this.prisma.user.update({
        where: {
          username: username,
        },
        data: {
          token: this.signToken(
            user.id,
            user.username,
            permissions.map((p) => p.name),
          ),
        },
      });
      delete userWithNewToken.password;
      return userWithNewToken;
    }
  }

  signToken(userId: number, username: string, permissions: string[]) {
    const payload: IJwtPayload = { sub: userId, username, permissions };

    return this.jwtService.sign(payload, {
      // expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async changePassword(jwtPayload: IJwtPayload, body: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { username: jwtPayload.username },
    });
    const pwMatches = await argon.verify(user.password, body.currentPassword);
    if (!pwMatches) {
      throw new ForbiddenException('Mật khẩu hiện tại sai');
    }
    if (body.newPassword != body.newConfirmPassword) {
      throw new ForbiddenException('Mật khẩu mới không khớp');
    }
    await this.prisma.user.update({
      where: { username: jwtPayload.username },
      data: { password: await argon.hash(body.newPassword) },
    });
    return SUCCESS_RESPONSE;
  }
}
