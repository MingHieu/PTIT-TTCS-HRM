import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { IJwtPayload, LoginDto } from './auth/dto';
import { initApi } from './helpers';
import { PERMISSIONS } from './auth/constants';
import { PrismaService } from './database/prisma/prisma.service';

@Injectable()
export class AppService {
  api: INestApplication;
  auth: AuthService;
  prisma: PrismaClient;
  constructor() {
    this.init();
  }

  async init() {
    this.api = await initApi();
    this.prisma = this.api.get(PrismaService);
    this.auth = this.api.get(AuthService);
  }

  checkLogin(user: IJwtPayload, res: Response, view, renderOptions) {
    if (user) {
      return res.redirect('/');
    }
    return res.render(view, renderOptions);
  }

  async login(body: LoginDto, res: Response) {
    try {
      const user = await this.auth.login({ ...body });
      const canLogin = await this.prisma.permission.findFirst({
        where: { name: PERMISSIONS.LOGIN_ADMIN.name, role: user.role },
      });
      if (!canLogin) {
        throw new Error('Không có quyền truy cập');
      }
      res.cookie('jwt_token', user.token, {
        httpOnly: true,
      });
      return res.redirect('/');
    } catch (e) {
      return res.render('login', {
        title: 'Đăng nhập',
        css: 'login.css',
        layout: 'other',
        errorMsg: e.message,
      });
    }
  }

  signOut(res: Response) {
    res.clearCookie('jwt_token');
    return res.redirect('/login');
  }
}
