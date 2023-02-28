import { PrismaClient } from '@prisma/client';
import { INestApplication, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { ChangePasswordDto, IJwtPayload, LoginDto } from 'src/auth/dto';
import { initApi } from 'src/helpers';
import { PERMISSIONS, ROLES } from 'src/auth/constants';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UserService } from 'src/model/user/user.service';
import { NewsService } from 'src/model/news/news.service';
import { EventService } from 'src/model/event/event.service';
import { FileService } from 'src/model/file/file.service';
import { NewsCreateDto } from 'src/model/news/dto';
import { EventCreateDto } from 'src/model/event/dto';
import { UserCreateDto } from 'src/model/user/dto';
import { GENDERS } from 'src/common/constants';
@Injectable()
export class AppService {
  #api: INestApplication;
  #auth: AuthService;
  #prisma: PrismaClient;
  #news: NewsService;
  #event: EventService;
  #user: UserService;
  #file: FileService;
  constructor() {
    this.init();
  }

  async init() {
    this.#api = await initApi();
    this.#prisma = this.#api.get(PrismaService);
    this.#auth = this.#api.get(AuthService);
    this.#news = this.#api.get(NewsService);
    this.#event = this.#api.get(EventService);
    this.#user = this.#api.get(UserService);
    this.#file = this.#api.get(FileService);
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

  async home() {
    const userCount = await this.#prisma.user.count();
    const projectCount = await this.#prisma.project.count();
    const eventCount = await this.#prisma.event.count();
    const requestCount = await this.#prisma.request.count();

    return {
      title: 'Trang chủ',
      css: 'home.css',
      js: 'home.js',
      jsLibrary: [
        '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
      ],
      header: true,
      layout: 'other',
      data: {
        userCount,
        projectCount,
        eventCount,
        requestCount,
      },
    };
  }

  async project() {
    return {
      title: 'Dự án',
      css: 'project.css',
      header: true,
    };
  }

  async news(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    const data = await this.#news.getMany(page - 1, perPage, keySearch);
    return {
      title: 'Bản tin',
      css: 'news.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async createNews(body: NewsCreateDto, thumbnail?: File) {
    return this.#news.create(body, thumbnail);
  }

  async updateNews(id: number, body: NewsCreateDto, thumbnail?: File) {
    return this.#news.update({ ...body, id }, thumbnail);
  }

  async getNews(id: number) {
    const renderOptions = {
      title: 'Chỉnh sửa bản tin',
      css: 'news-create.css',
      js: 'news-create.js',
      header: true,
      jsLibrary: [
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/image@latest"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/nested-list@latest"></script>',
      ],
      edit: true,
    };
    const news = await this.#news.getOne(id);
    return { ...renderOptions, data: { news } };
  }

  async deleteNews(id: number, res: Response) {
    await this.#news.delete(id);
    return res.redirect('/');
  }

  async event(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    const data = await this.#event.getMany(page - 1, perPage, keySearch);
    return {
      title: 'Danh sách sự kiện',
      css: 'event.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async createEvent(body: EventCreateDto) {
    return this.#event.create(body);
  }

  async updateEvent(id: number, body: EventCreateDto) {
    return this.#event.update({ ...body, id });
  }

  async getEvent(id: number) {
    const renderOptions = {
      title: 'Chỉnh sửa sự kiện',
      css: 'event-create.css',
      js: 'event-create.js',
      header: true,
      edit: true,
    };
    const news = await this.#event.getOne(id);
    return { ...renderOptions, data: { news } };
  }

  async deleteEvent(id: number, res: Response) {
    await this.#event.delete(id);
    return res.redirect('/event');
  }

  async employee(page: number, perPage: number, keySearch: string) {
    if (!page) page = 1;
    if (!perPage) perPage = 10;
    if (!keySearch) keySearch = '';
    const data = await this.#user.getMany(page - 1, perPage, keySearch);
    return {
      title: 'Danh sách nhân viên',
      css: 'employee.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async createEmployee(body: UserCreateDto, avatar?: File) {
    return this.#user.create(body, avatar);
  }

  async updateEmployee(username: string, body: UserCreateDto, avatar?: File) {
    const user = await this.#user.update(username, body, avatar);
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-information.css',
      js: 'employee-detail-information.js',
      information: true,
      layout: 'employee-detail',
      data: {
        user,
        roles: ROLES,
        sex: GENDERS,
      },
      successMsg: 'Cập nhật thành công',
    };
  }

  async employeeInformationDetail(username: string) {
    const user = await this.#user.getOne(username);
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-information.css',
      js: 'employee-detail-information.js',
      information: true,
      layout: 'employee-detail',
      data: {
        user,
        roles: ROLES,
        sex: GENDERS,
      },
    };
  }

  async deleteAccount(
    jwtPayload: IJwtPayload,
    username: string,
    res: Response,
  ) {
    await this.#user.delete(username);
    if (jwtPayload.username === username) {
      return this.signOut(res);
    }
    return res.redirect('/employee');
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

  async changePassword(
    jwtPayload: IJwtPayload,
    body: ChangePasswordDto,
    action,
  ) {
    const renderOptions = {
      title: 'Thông tin cá nhân',
      css: 'profile.css',
      js: 'profile.js',
      header: true,
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

  async uploadFile(file: File) {
    const uploadedFile = await this.#file.create(file);
    return {
      success: 1,
      file: uploadedFile,
    };
  }

  async getFile(id: number, res: Response) {
    const file = await this.#file.getOne(id, res);
    return file;
  }
}
