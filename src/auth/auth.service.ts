import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import * as argon from 'argon2';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { SignupDto, IJwtPayload, LoginDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(body: SignupDto) {
    try {
      const hashPassword = await argon.hash(body.password);
      const user = await this.prisma.user.create({
        data: {
          ...body,
          password: hashPassword,
        },
      });
      const permissions = await this.prisma.permission.findMany({
        where: { role: user.role },
        select: { name: true },
      });
      const userWithToken = await this.prisma.user.update({
        where: { username: user.username },
        data: {
          token: this.signToken(
            user.id,
            permissions.map((p) => p.name),
          ),
        },
      });
      delete userWithToken.password;
      return userWithToken;
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new ForbiddenException('username already exists');
        }
      }
      throw e;
    }
  }

  async login(props: LoginDto) {
    const { username, password } = props;

    const user = await this.prisma.user.findUnique({
      where: {
        username: username,
      },
    });
    if (!user) throw new ForbiddenException('username is incorrect');

    const pwMatches = await argon.verify(user.password, password);
    if (!pwMatches) throw new ForbiddenException('password is incorrect');

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
            permissions.map((p) => p.name),
          ),
        },
      });
      delete userWithNewToken.password;
      return userWithNewToken;
    }
  }

  signToken(userId: number, permissions: string[]) {
    const payload: IJwtPayload = { sub: userId, userId, permissions };

    return this.jwtService.sign(payload, {
      // expiresIn: '1d',
      secret: this.config.get('JWT_SECRET'),
    });
  }
}
