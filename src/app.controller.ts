import { JwtCookiePublishGuard } from './auth/guard';
import {
  Get,
  Controller,
  Render,
  Param,
  Res,
  Post,
  Body,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { GetUser, Public } from './auth/decorator';
import { LoginDto } from './auth/dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Public()
  @UseGuards(JwtCookiePublishGuard)
  @Get('login')
  loginGet(@GetUser() user, @Res() res) {
    return this.appService.checkLogin(user, res, 'login', {
      title: 'Đăng nhập',
      css: 'login.css',
      layout: 'other',
    });
  }

  @Public()
  @Post('login')
  loginPost(@Body() body: LoginDto, @Res() res) {
    return this.appService.login(body, res);
  }

  @Get('signout')
  signOut(@Res() res) {
    return this.appService.signOut(res);
  }

  @Get()
  @Render('home')
  root() {
    return {
      title: 'Trang chủ',
      css: 'home.css',
      header: true,
      pagination: true,
    };
  }

  @Get('news/create')
  @Render('news-create')
  newsCreate() {
    return {
      title: 'Tạo bản tin mới',
      css: 'news-create.css',
      js: 'news-create.js',
      header: true,
      jsLibrary: [
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/editorjs@latest"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/header@latest"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/image@latest"></script>',
        '<script src="https://cdn.jsdelivr.net/npm/@editorjs/nested-list@latest"></script>',
      ],
    };
  }

  @Get('news/edit/:newsId')
  @Render('news-create')
  newsEdit() {
    return {
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
  }

  @Get('event')
  @Render('event')
  event() {
    return {
      title: 'Danh sách sự kiện',
      css: 'event.css',
      header: true,
      pagination: true,
    };
  }

  @Get('event/create')
  @Render('event-create')
  eventCreate() {
    return {
      title: 'Tạo sự kiện mới',
      css: 'event-create.css',
      header: true,
    };
  }

  @Get('event/edit/:eventId')
  @Render('event-create')
  eventEdit() {
    return {
      title: 'Chỉnh sửa sự kiện',
      css: 'event-create.css',
      header: true,
      edit: true,
    };
  }

  @Get('employee')
  @Render('employee')
  employee() {
    return {
      title: 'Danh sách nhân viên',
      css: 'employee.css',
      header: true,
      pagination: true,
    };
  }

  @Get('employee/create')
  @Render('employee-create')
  employeeCreate() {
    return {
      title: 'Tạo nhân viên mới',
      css: 'employee-create.css',
      header: true,
    };
  }

  @Get('employee/:userId/information')
  @Render('employee-detail-information')
  employeeInformationDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-information.css',
      information: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:userId/salary')
  @Render('employee-detail-salary')
  employeeSalaryDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-salary.css',
      salary: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:userId/attendance')
  @Render('employee-detail-attendance')
  employeeAttendanceDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-attendance.css',
      attendance: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:userId/request')
  @Render('employee-detail-request')
  employeeRequestDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-request.css',
      request: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:userId/event')
  @Render('employee-detail-event')
  employeeEventDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-event.css',
      event: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:userId')
  employeeDetail(@Param('userId') userId, @Res() res: Response) {
    return res.redirect(`${userId}/information`);
  }

  @Get('request')
  @Render('request')
  request() {
    return {
      title: 'Danh sách yêu cầu',
      css: 'request.css',
      header: true,
      pagination: true,
    };
  }

  @Get('request/:requestId')
  @Render('request-detail')
  requestDetail() {
    return {
      title: 'Chi tiết yêu cầu',
      css: 'request-detail.css',
      header: true,
    };
  }

  @Get('profile')
  @Render('profile')
  profile() {
    return {
      title: 'Thông tin cá nhân',
      css: 'profile.css',
      js: 'profile.js',
      header: true,
    };
  }
}
