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
  Query,
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
  root(
    @Query('page') page,
    @Query('quantity') quantity,
    @Query('keySearch') keySearch,
  ) {
    return this.appService.news(page, quantity, keySearch);
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
  event(
    @Query('page') page,
    @Query('quantity') quantity,
    @Query('keySearch') keySearch,
  ) {
    return this.appService.event(page, quantity, keySearch);
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
  employee(
    @Query('page') page,
    @Query('quantity') quantity,
    @Query('keySearch') keySearch,
  ) {
    return this.appService.employee(page, quantity, keySearch);
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

  @Get('employee/:username/information')
  @Render('employee-detail-information')
  employeeInformationDetail(@Param('username') username) {
    return this.appService.employeeInformationDetail(username);
  }

  @Get('employee/:username/salary')
  @Render('employee-detail-salary')
  employeeSalaryDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-salary.css',
      salary: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:username/attendance')
  @Render('employee-detail-attendance')
  employeeAttendanceDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-attendance.css',
      attendance: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:username/request')
  @Render('employee-detail-request')
  employeeRequestDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-request.css',
      request: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:username/event')
  @Render('employee-detail-event')
  employeeEventDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-event.css',
      event: true,
      layout: 'employee-detail',
    };
  }

  @Get('employee/:username')
  employeeDetail(@Param('username') username, @Res() res: Response) {
    return res.redirect(`${username}/information`);
  }

  @Get('request')
  @Render('request')
  request() {
    return {
      title: 'Danh sách yêu cầu',
      css: 'request.css',
      header: true,
      // pagination: true,
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
  profile(@GetUser() user) {
    return this.appService.profile(user);
  }

  @Post('profile')
  @Render('profile')
  changePassword(@GetUser() user, @Body() body, @Query('action') action) {
    return this.appService.changePassword(user, body, action);
  }
}
