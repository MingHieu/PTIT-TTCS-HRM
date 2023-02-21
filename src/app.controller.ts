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

  @Get()
  @Render('home')
  root() {
    return {
      title: 'Trang chủ',
      css: 'home.css',
      js: 'home.js',
      header: true,
      pagination: true,
    };
  }

  @Get('event')
  @Render('event')
  event() {
    return {
      title: 'Danh sách sự kiện',
      css: 'event.css',
      js: 'event.js',
      header: true,
      pagination: true,
    };
  }

  @Get('employee')
  @Render('employee')
  employee() {
    return {
      title: 'Danh sách nhân viên',
      css: 'employee.css',
      js: 'employee.js',
      header: true,
      pagination: true,
    };
  }

  @Get('request')
  @Render('request')
  request() {
    return {
      title: 'Danh sách yêu cầu',
      css: 'request.css',
      js: 'request.js',
      header: true,
      pagination: true,
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

  @Public()
  @UseGuards(JwtCookiePublishGuard)
  @Get('login')
  loginGet(@GetUser() user, @Res() res) {
    return this.appService.checkLogin(user, res, 'login', {
      title: 'Đăng nhập',
      css: 'login.css',
      header: false,
      layout: 'other',
    });
  }

  @Public()
  @Post('login')
  loginPost(@Body() body: LoginDto, @Res() res) {
    return this.appService.login(body, res);
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
}
