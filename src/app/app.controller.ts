import { JwtCookiePublishGuard } from 'src/auth/guard';
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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from 'src/app/app.service';
import { GetUser, Public } from 'src/auth/decorator';
import { LoginDto } from 'src/auth/dto';
import { ROLES } from 'src/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateNewsDto } from './dto';

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
  newsCreateGet() {
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

  @Post('news/create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  newsCreatePost(@UploadedFile() thumbnail, @Body() body: CreateNewsDto) {
    return this.appService.createNews(thumbnail, body);
  }

  @Get('news/edit/:newsId')
  @Render('news-create')
  newsEditGet(@Param('newsId') newsId) {
    return this.appService.getNews(newsId);
  }

  @Post('news/edit/:newsId')
  @UseInterceptors(FileInterceptor('thumbnail'))
  newsEditPost(
    @Param('newsId') newsId,
    @UploadedFile() thumbnail,
    @Body() body: CreateNewsDto,
  ) {
    return this.appService.updateNews(newsId, thumbnail, body);
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
      data: {
        roles: ROLES,
      },
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

  @Post('file')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return this.appService.uploadFile(image);
  }

  @Get('file/:fileId')
  getFile(@Param('fileId') fileId, @Res({ passthrough: true }) res) {
    return this.appService.getFile(fileId, res);
  }
}
