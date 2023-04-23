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
import { GENDERS } from 'src/model/user/constants';
import { ProjectCreateDto } from 'src/model/project/dto';
import { ProjectService } from 'src/model/project/project.service';
import { RequestService } from 'src/model/request/request.service';
import { PROJECT_STATUS } from 'src/model/project/constants';
import { SkillService } from 'src/model/skill/skill.service';
import { NotificationService } from 'src/model/notification/notification.service';
import { SettingService } from 'src/model/setting/setting.service';
import { SETTING } from 'src/model/setting/constants';
import { NotificationCreateDto } from 'src/model/notification/dto';
import { SalaryService } from 'src/model/salary/salary.service';
import { SalaryCreateDto } from 'src/model/salary/dto';
import { AttendanceService } from 'src/model/attendance/attendance.service';
import { AttendanceExportDto } from 'src/model/attendance/dto';
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
  #notification: NotificationService;
  #setting: SettingService;
  #salary: SalaryService;
  #attendance: AttendanceService;

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
    this.#notification = this.#api.get(NotificationService);
    this.#setting = this.#api.get(SettingService);
    this.#salary = this.#api.get(SalaryService);
    this.#attendance = this.#api.get(AttendanceService);
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
    const userStatistic = await this.#user.statistic();
    const projectStatistic = await this.#project.statistic();
    const userCount = await this.#prisma.user.count();
    const projectCount = projectStatistic[new Date().getMonth()];
    const eventCount = await this.#prisma.event.count({
      where: { to: { gt: new Date() } },
    });
    const requestCount = await this.#prisma.request.count({
      where: { status: REQUEST_STATUS.pending },
    });

    return {
      title: 'Trang chủ',
      css: 'home.css',
      js: 'home.js',
      jsLibrary: [
        '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
      ],
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
    return res.redirect(`/employee/${username}/information`);
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
    const salaries = await this.#salary.getAllByUsername(username);

    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-salary.css',
      salary: true,
      layout: 'employee-detail',
      data: {
        data: salaries,
        username,
      },
    };
  }

  async updateEmployeeSalary(
    username: string,
    body: SalaryCreateDto,
    res: Response,
  ) {
    await this.#salary.create(body, username);

    return res.redirect(`/employee/${username}/salary`);
  }

  async employeeAttendanceDetail(username: string, page) {
    const attendances = await this.#attendance.getManyByUsername(
      username,
      page,
    );

    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-attendance.css',
      attendance: true,
      layout: 'employee-detail',
      data: attendances,
      pagination: true,
    };
  }

  async employeeProjectDetail(username: string) {
    const projects = await this.#project.getAllByUsername(username);

    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-project.css',
      project: true,
      layout: 'employee-detail',
      data: projects,
    };
  }

  async employeeRequestDetail(username: string) {
    const requests = await this.#request.getAllByUsername(username);

    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-request.css',
      request: true,
      layout: 'employee-detail',
      data: requests,
    };
  }

  async employeeEventDetail(username: string) {
    const events = await this.#event.getAllByUsername(username);

    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-event.css',
      event: true,
      layout: 'employee-detail',
      data: events,
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
      pagination: true,
      data,
    };
  }

  async getRequest(id: number, action: string) {
    const renderOptions = {
      title: 'Chi tiết yêu cầu',
      css: 'request-detail.css',
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

  async notification(page: number, perPage: number, keySearch: string) {
    const data = await this.#notification.getMany(page, perPage, keySearch);
    return {
      title: 'Thông báo',
      css: 'notification.css',
      pagination: true,
      data,
    };
  }

  async createNotification(body: NotificationCreateDto, res: Response) {
    await this.#notification.create(body);
    return res.redirect('/notification');
  }

  async getNotification(id: number) {
    const notification = await this.#notification.getOne(id);
    return {
      title: 'Chi tiết thông báo',
      css: 'notification-create.css',
      data: notification,
    };
  }

  async deleteNotification(id: number, res: Response) {
    await this.#notification.delete(id);
    return res.redirect('/notification');
  }

  async getSetting() {
    const settingList = await this.#setting.getAll();

    return {
      title: 'Cài đặt chung',
      css: 'setting.css',
      data: settingList,
    };
  }

  async updateSetting(
    body: {
      [key in typeof SETTING[keyof typeof SETTING]['name']]: string;
    },
    res: Response,
  ) {
    for (const key in body) {
      await this.#setting.update(
        key as typeof SETTING[keyof typeof SETTING]['name'],
        body[key],
      );
    }
    return res.redirect('/setting');
  }

  async exportAttendance(body: AttendanceExportDto) {
    const attendances = await this.#attendance.getAllByFromTo(body);
    return {
      title: 'Xuất báo cáo chấm công',
      css: 'export-attendance.css',
      js: 'export-attendance.js',
      jsLibrary: [
        '<script lang="javascript" src="https://cdn.sheetjs.com/xlsx-latest/package/dist/xlsx.full.min.js"></script>',
      ],
      data: JSON.stringify(attendances),
    };
  }
}
