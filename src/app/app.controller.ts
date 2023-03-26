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
import { ChangePasswordDto, IJwtPayload, LoginDto } from 'src/auth/dto';
import { ROLES } from 'src/auth/constants';
import { FileInterceptor } from '@nestjs/platform-express';
import { NewsCreateDto } from 'src/model/news/dto';
import { EventCreateDto } from 'src/model/event/dto';
import { PaginationDto } from 'src/common/dto';
import { ParseIntPipe } from 'src/common/pipe';
import { UserCreateDto } from 'src/model/user/dto';
import { GENDERS } from 'src/model/user/constants';
import { ProjectCreateDto } from 'src/model/project/dto';
import { NotificationCreateDto } from 'src/model/notification/dto';
import { SalaryCreateDto } from 'src/model/salary/dto';
import { AttendanceExportDto } from 'src/model/attendance/dto';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Public()
  @UseGuards(JwtCookiePublishGuard)
  @Get('login')
  loginGet(@GetUser() user: IJwtPayload, @Res() res: Response) {
    return this.appService.checkLogin(user, res, 'login', {
      title: 'Đăng nhập',
      css: 'login.css',
      layout: 'other',
    });
  }

  @Public()
  @Post('login')
  loginPost(@Body() body: LoginDto, @Res() res: Response) {
    return this.appService.login(body, res);
  }

  @Get('signout')
  signOut(@Res() res: Response) {
    return this.appService.signOut(res);
  }

  @Get()
  @Render('home')
  root() {
    return this.appService.home();
  }

  @Get('project')
  @Render('project')
  project(@Query() query: PaginationDto) {
    return this.appService.project(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get('project/create')
  @Render('project-create')
  projectCreateGet() {
    return this.appService.getProjectCreate();
  }

  @Post('project/create')
  projectCreatePost(@Body() body: ProjectCreateDto) {
    return this.appService.createProject(body);
  }

  @Get('project/:id/edit')
  @Render('project-create')
  projectEditGet(@Param('id', new ParseIntPipe()) id) {
    return this.appService.getProjectEdit(id);
  }

  @Post('project/:id/edit')
  projectEditPost(
    @Param('id', new ParseIntPipe()) id,
    @Body() body: ProjectCreateDto,
  ) {
    return this.appService.updateProject(id, body);
  }

  @Get('project/:id/delete')
  projectDelete(@Param('id', new ParseIntPipe()) id, @Res() res: Response) {
    return this.appService.deleteProject(id, res);
  }

  @Get('employee')
  @Render('employee')
  employee(@Query() query: PaginationDto) {
    return this.appService.employee(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get('employee/all')
  getManyEmployee(@Query() query: PaginationDto) {
    return this.appService.getManyEmployee(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get('employee/create')
  @Render('employee-create')
  employeeCreateGet() {
    return {
      title: 'Tạo nhân viên mới',
      css: 'employee-create.css',
      js: 'employee-create.js',

      data: {
        sex: GENDERS,
        roles: ROLES,
      },
    };
  }

  @Post('employee/create')
  @UseInterceptors(FileInterceptor('avatar'))
  employeeCreatePost(@Body() body: UserCreateDto, @UploadedFile() avatar) {
    return this.appService.createEmployee(body, avatar);
  }

  @Get('employee/:username/information')
  @Render('employee-detail-information')
  employeeInformationDetailGet(@Param('username') username) {
    return this.appService.employeeInformationDetail(username);
  }

  @Post('employee/:username/information')
  @UseInterceptors(FileInterceptor('avatar'))
  employeeInformationDetailPost(
    @Param('username') username,
    @Body() body: UserCreateDto,
    @UploadedFile() avatar,
    @GetUser() jwtPayload: IJwtPayload,
    @Res() res: Response,
  ) {
    return this.appService.updateEmployee(
      jwtPayload,
      res,
      username,
      body,
      avatar,
    );
  }

  @Get('employee/:username/salary')
  @Render('employee-detail-salary')
  employeeSalaryDetailGet(@Param('username') username) {
    return this.appService.employeeSalaryDetail(username);
  }

  @Get('employee/:username/salaryUpdate')
  @Render('employee-detail-salary-update')
  employeeSalaryDetailUpdateGet(@Param('username') username) {
    return {
      title: 'Cập nhật lương',
      css: 'employee-detail-salary-update.css',
      data: {
        username,
      },
    };
  }

  @Post('employee/:username/salaryUpdate')
  employeeSalaryDetailUpdatePost(
    @Param('username') username,
    @Body() body: SalaryCreateDto,
    @Res() res: Response,
  ) {
    return this.appService.updateEmployeeSalary(username, body, res);
  }

  @Get('employee/:username/attendance')
  @Render('employee-detail-attendance')
  employeeAttendanceDetail(
    @Param('username') username,
    @Query() query: PaginationDto,
  ) {
    return this.appService.employeeAttendanceDetail(username, query.page);
  }

  @Get('employee/:username/project')
  @Render('employee-detail-project')
  employeeProjectDetail(@Param('username') username) {
    return this.appService.employeeProjectDetail(username);
  }

  @Get('employee/:username/request')
  @Render('employee-detail-request')
  employeeRequestDetail(@Param('username') username) {
    return this.appService.employeeRequestDetail(username);
  }

  @Get('employee/:username/event')
  @Render('employee-detail-event')
  employeeEventDetail(@Param('username') username) {
    return this.appService.employeeEventDetail(username);
  }

  @Get('employee/:username/delete')
  employeeDelete(
    @GetUser() jwtPayload: IJwtPayload,
    @Param('username') username,
    @Res() res: Response,
  ) {
    return this.appService.deleteAccount(jwtPayload, username, res);
  }

  @Get('employee/:username')
  employeeDetail(@Res() res: Response) {
    return res.redirect(`information`);
  }

  @Get('event')
  @Render('event')
  event(@Query() query: PaginationDto) {
    return this.appService.event(query.page, query.per_page, query.key_search);
  }

  @Get('event/create')
  @Render('event-create')
  eventCreateGet() {
    return {
      title: 'Tạo sự kiện mới',
      css: 'event-create.css',
      js: 'event-create.js',
    };
  }

  @Post('event/create')
  eventCreatePost(@Body() body: EventCreateDto) {
    return this.appService.createEvent(body);
  }

  @Get('event/:id/edit')
  @Render('event-create')
  eventEditGet(@Param('id', new ParseIntPipe()) id) {
    return this.appService.getEvent(id);
  }

  @Post('event/:id/edit')
  eventEditPost(
    @Param('id', new ParseIntPipe()) id,
    @Body() body: EventCreateDto,
  ) {
    return this.appService.updateEvent(id, body);
  }

  @Get('event/:id/delete')
  eventDelete(@Param('id', new ParseIntPipe()) id, @Res() res: Response) {
    return this.appService.deleteEvent(id, res);
  }

  @Get('request')
  @Render('request')
  request(@Query() query: PaginationDto) {
    return this.appService.request(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get('request/:id')
  @Render('request-detail')
  requestDetailGet(
    @Param('id', new ParseIntPipe()) id,
    @Query('action') action: string,
  ) {
    return this.appService.getRequest(id, action);
  }

  @Get('news')
  @Render('news')
  news(@Query() query: PaginationDto) {
    return this.appService.news(query.page, query.per_page, query.key_search);
  }

  @Get('news/create')
  @Render('news-create')
  newsCreateGet() {
    return {
      title: 'Tạo bản tin mới',
      css: 'news-create.css',
      js: 'news-create.js',
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
  newsCreatePost(@Body() body: NewsCreateDto, @UploadedFile() thumbnail) {
    return this.appService.createNews(body, thumbnail);
  }

  @Get('news/:id/edit')
  @Render('news-create')
  newsEditGet(@Param('id', new ParseIntPipe()) id) {
    return this.appService.getNews(id);
  }

  @Post('news/:id/edit')
  @UseInterceptors(FileInterceptor('thumbnail'))
  newsEditPost(
    @Param('id', new ParseIntPipe()) id,
    @Body() body: NewsCreateDto,
    @UploadedFile() thumbnail,
  ) {
    return this.appService.updateNews(id, body, thumbnail);
  }

  @Get('news/:id/delete')
  newsDelete(@Param('id', new ParseIntPipe()) id, @Res() res: Response) {
    return this.appService.deleteNews(id, res);
  }

  @Get('profile')
  @Render('profile')
  profileGet(@GetUser() user) {
    return this.appService.profile(user);
  }

  @Post('profile')
  @Render('profile')
  profilePost(
    @GetUser() user,
    @Body() body: ChangePasswordDto,
    @Query('action') action,
  ) {
    return this.appService.changePassword(user, body, action);
  }

  @Post('file')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image) {
    return this.appService.uploadFile(image);
  }

  @Get('file/:id')
  getFile(
    @Param('id', new ParseIntPipe()) id,
    @Res({ passthrough: true }) res,
  ) {
    return this.appService.getFile(id, res);
  }

  @Get('notification')
  @Render('notification')
  notification(@Query() query: PaginationDto) {
    return this.appService.notification(
      query.page,
      query.per_page,
      query.key_search,
    );
  }

  @Get('notification/create')
  @Render('notification-create')
  notificationCreateGet() {
    return {
      title: 'Tạo thông báo mới',
      css: 'notification-create.css',
      create: true,
    };
  }

  @Post('notification/create')
  notificationCreatePost(
    @Body() body: NotificationCreateDto,
    @Res() res: Response,
  ) {
    return this.appService.createNotification(body, res);
  }

  @Get('notification/:id')
  @Render('notification-create')
  notificationDetail(@Param('id', new ParseIntPipe()) id) {
    return this.appService.getNotification(id);
  }

  @Get('notification/:id/delete')
  notificationDelete(
    @Param('id', new ParseIntPipe()) id,
    @Res() res: Response,
  ) {
    return this.appService.deleteNotification(id, res);
  }

  @Get('setting')
  @Render('setting')
  settingGet() {
    return this.appService.getSetting();
  }

  @Post('setting')
  settingPost(@Body() body, @Res() res) {
    return this.appService.updateSetting(body, res);
  }

  @Get('other')
  @Render('other-tool')
  otherTool() {
    return {
      title: 'Công cụ',
      css: 'other-tool.css',
    };
  }

  @Get('exportAttendance')
  @Render('export-attendance')
  exportAttendanceGet() {
    return {
      title: 'Xuất báo cáo chấm công',
      css: 'export-attendance.css',
    };
  }

  @Post('exportAttendance')
  @Render('export-attendance')
  exportAttendancePost(@Body() body: AttendanceExportDto) {
    return this.appService.exportAttendance(body);
  }
}
