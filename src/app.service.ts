import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { IJwtPayload, LoginDto } from 'src/auth/dto';
import { initApi } from 'src/helpers';
import { PERMISSIONS, ROLES } from 'src/auth/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserService } from 'src/model/user/user.service';
@Injectable()
export class AppService {
  #api: INestApplication;
  #auth: AuthService;
  #prisma: PrismaClient;
  #user: UserService;
  constructor() {
    this.init();
  }

  async init() {
    this.#api = await initApi();
    this.#prisma = this.#api.get(PrismaService);
    this.#auth = this.#api.get(AuthService);
    this.#user = this.#api.get(UserService);
  }

  checkLogin(jwtPayload: IJwtPayload, res: Response, view, renderOptions) {
    if (jwtPayload) {
      return res.redirect('/');
    }
    return res.render(view, renderOptions);
  }

  async login(body: LoginDto, res: Response) {
    try {
      const user = await this.#auth.login({ ...body });
      const canLogin = await this.#prisma.permission.findFirst({
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

  async employee(page, quantity, keySearch) {
    if (!page) page = 1;
    if (!quantity) quantity = 10;
    if (!keySearch) keySearch = '';
    const data = await this.#user.getMany(+page - 1, +quantity, keySearch);
    return {
      title: 'Danh sách nhân viên',
      css: 'employee.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async employeeInformationDetail(username) {
    const data = await this.#user.getOne(username);
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-information.css',
      js: 'employee-detail-information.js',
      information: true,
      layout: 'employee-detail',
      data: {
        ...data,
        roles: ROLES,
      },
    };
  }

  async profile(jwtPayload: IJwtPayload) {
    const user = await this.#user.getOne(jwtPayload.username);
    return {
      title: 'Thông tin cá nhân',
      css: 'profile.css',
      js: 'profile.js',
      header: true,
      data: { user },
    };
  }

  async changePassword(jwtPayload: IJwtPayload, body, action) {
    const renderOptions = {
      title: 'Thông tin cá nhân',
      css: 'profile.css',
      js: 'profile.js',
      header: true,
      jsLibrary: [
        '<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/toastify-js"></script>',
      ],
      cssLibrary: [
        '<link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css">',
      ],
    };
    if (action === 'changePassword') {
      try {
        await this.#auth.changePassword(jwtPayload, body);
        return {
          ...renderOptions,
          successMsg: 'Đổi mật khẩu thành công',
        };
      } catch (e) {
        return {
          ...renderOptions,
          errorMsg: e.message,
        };
      }
    }
    return {
      ...renderOptions,
      errorMsg: 'Thao tác không tìm thấy',
    };
  }
}
