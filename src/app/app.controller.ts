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
import { GENDERS } from 'src/common/constants';
import { ProjectCreateDto } from 'src/model/project/dto';

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
    return this.appService.getCreateProject();
  }

  @Post('project/create')
  projectCreatePost(@Body() body: ProjectCreateDto) {
    return this.appService.createProject(body);
  }

  @Get('project/:id/edit')
  @Render('project-create')
  projectEditGet() {
    return {
      title: 'Chỉnh sửa dự án',
      css: 'project-create.css',
      js: 'project-create.js',
      header: true,
      edit: true,
      data: {
        sex: GENDERS,
        roles: ROLES,
      },
    };
  }

  @Post('project/:id/edit')
  projectEditPost(@Param('id') id, @Body() body: ProjectCreateDto) {
    return this.appService.updateProject(id, body);
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

  @Get('employee/create')
  @Render('employee-create')
  employeeCreateGet() {
    return {
      title: 'Tạo nhân viên mới',
      css: 'employee-create.css',
      js: 'employee-create.js',
      header: true,
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
  @Render('employee-detail-information')
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

  @Get('employee/:username/project')
  @Render('employee-detail-project')
  employeeProjectDetail() {
    return {
      title: 'Thông tin nhân viên',
      css: 'employee-detail-project.css',
      project: true,
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

  @Get('employee/:username/delete')
  employeeDelete(
    @GetUser() jwtPayload: IJwtPayload,
    @Param('username') username,
    @Res() res: Response,
  ) {
    return this.appService.deleteAccount(jwtPayload, username, res);
  }

  @Get('employee/:username')
  employeeDetail(@Param('username') username, @Res() res: Response) {
    return res.redirect(`${username}/information`);
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
      header: true,
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
}