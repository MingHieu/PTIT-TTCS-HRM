import { REQUEST_STATUS } from 'src/model/request/constants';
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
import { ProjectCreateDto } from 'src/model/project/dto';
import { ProjectService } from 'src/model/project/project.service';
import { RequestService } from 'src/model/request/request.service';
import { PROJECT_STATUS } from 'src/model/project/constants';
import { SkillService } from 'src/model/skill/skill.service';
import { SalaryService } from 'src/model/salary/salary.service';
@Injectable()
export class AppService {
  #api: INestApplication;
  #auth: AuthService;
  #prisma: PrismaClient;
  #news: NewsService;
  #event: EventService;
  #user: UserService;
  #file: FileService;
  #project: ProjectService;
  #request: RequestService;
  #skill: SkillService;
  #salary: SalaryService;

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
    this.#project = this.#api.get(ProjectService);
    this.#request = this.#api.get(RequestService);
    this.#skill = this.#api.get(SkillService);
    this.#salary = this.#api.get(SalaryService);
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
      res.cookie('user_avatar', user.avatar);
      res.cookie('username', user.username);
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
    const userStatistic = await this.#user.statistic();
    const projectStatistic = await this.#project.statistic();

    return {
      title: 'Trang chủ',
      css: 'home.css',
      js: 'home.js',
      jsLibrary: [
        '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
      ],
      header: true,
      data: {
        userCount,
        projectCount,
        eventCount,
        requestCount,
        userStatistic: JSON.stringify(userStatistic),
        projectStatistic: JSON.stringify(projectStatistic),
      },
    };
  }

  async project(page: number, perPage: number, keySearch: string) {
    const data = await this.#project.getMany(page, perPage, keySearch);
    return {
      title: 'Dự án',
      css: 'project.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async createProject(body: ProjectCreateDto) {
    return this.#project.create(body);
  }

  async updateProject(id: number, body: ProjectCreateDto) {
    return this.#project.update({ ...body, id });
  }

  async getProjectCreate() {
    const skills = await this.#skill.getAll();

    return {
      title: 'Tạo dự án mới',
      css: 'project-create.css',
      js: 'project-create.js',
      jsLibrary: [
        '<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>',
      ],
      header: true,
      data: {
        status: PROJECT_STATUS,
        skills: JSON.stringify(skills),
      },
    };
  }

  async getProjectEdit(id: number) {
    const project = await this.#project.getOne(id);
    const skills = await this.#skill.getAll();

    return {
      title: 'Chỉnh sửa dự án',
      css: 'project-create.css',
      js: 'project-create.js',
      jsLibrary: [
        '<script src="https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js"></script>',
      ],
      header: true,
      data: {
        status: PROJECT_STATUS,
        skills: JSON.stringify(skills),
        data: project,
        skillsChosen: JSON.stringify(project.skills),
        membersChosen: JSON.stringify(project.members),
        leader: JSON.stringify(project.leader),
      },
      edit: true,
    };
  }

  async deleteProject(id: number, res: Response) {
    await this.#project.delete(id);
    return res.redirect('/project');
  }

  async news(page: number, perPage: number, keySearch: string) {
    const data = await this.#news.getMany(page, perPage, keySearch);
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
    return res.redirect('/news');
  }

  async event(page: number, perPage: number, keySearch: string) {
    const data = await this.#event.getMany(page, perPage, keySearch);
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
    const data = await this.#user.getMany(page, perPage, keySearch);
    return {
      title: 'Danh sách nhân viên',
      css: 'employee.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async getManyEmployee(page: number, perPage: number, keySearch: string) {
    const data = await this.#user.getMany(page, perPage, keySearch);
    return data;
  }

  async createEmployee(body: UserCreateDto, avatar?: File) {
    return this.#user.create(body, avatar);
  }

  async updateEmployee(
    jwtPayload: IJwtPayload,
    res: Response,
    username: string,
    body: UserCreateDto,
    avatar?: File,
  ) {
    const user = await this.#user.update(username, body, avatar);
    if (user.username === jwtPayload.username) {
      res.cookie('user_avatar', user.avatar);
    }
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

  async employeeSalaryDetail(username: string) {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-salary.css',
      js: 'employee-detail-salary.js',
      salary: true,
      layout: 'employee-detail',
    };
  }

  async updateEmployeeSalary(username: string) {
    return true;
  }

  async employeeAttendanceDetail(username: string) {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-attendance.css',
      attendance: true,
      layout: 'employee-detail',
    };
  }

  async employeeProjectDetail(username: string) {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-project.css',
      project: true,
      layout: 'employee-detail',
    };
  }

  async employeeRequestDetail(username: string) {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-request.css',
      request: true,
      layout: 'employee-detail',
    };
  }

  async employeeEventDetail(username: string) {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-event.css',
      event: true,
      layout: 'employee-detail',
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

  async request(page: number, perPage: number, keySearch: string) {
    const data = await this.#request.getMany(page, perPage, keySearch);
    return {
      title: 'Danh sách yêu cầu',
      css: 'request.css',
      header: true,
      pagination: true,
      data,
    };
  }

  async getRequest(id: number, action: string) {
    const renderOptions = {
      title: 'Chi tiết yêu cầu',
      css: 'request-detail.css',
      header: true,
    };
    const request = await this.#request.getOne(id);
    if (action && request.status === REQUEST_STATUS.pending) {
      if (action === 'reject' || action === 'accept') {
        const request = await this.#request.update({
          id,
          status:
            action === 'reject' ? REQUEST_STATUS.reject : REQUEST_STATUS.accept,
        });
        return { ...renderOptions, data: { request } };
      }
      return {
        ...renderOptions,
        errorMsg: 'Thao tác không tìm thấy',
      };
    }
    return { ...renderOptions, data: { request } };
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
    action: string,
  ) {
    const renderOptions = {
      title: 'Thông tin cá nhân',
      css: 'profile.css',
      js: 'profile.js',
      header: true,
    };
    if (action === 'changePassword') {
      await this.#auth.changePassword(jwtPayload, body);
      return {
        ...renderOptions,
        successMsg: 'Đổi mật khẩu thành công',
      };
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
