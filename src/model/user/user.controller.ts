import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { UserCreateDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('update')
  update(@GetUser('username') username, @Body() body: UserCreateDto) {
    return this.userService.update(username, body);
  }

  @Get()
  get(@GetUser('username') username: string) {
    return this.userService.getOne(username);
  }

  @Get('salary')
  getSalary(@GetUser('username') username: string) {
    return this.userService.getSalary(username);
  }

  @Get('attendance')
  getAttendance(@GetUser('username') username: string) {
    return this.userService.getAttendance(username);
  }

  @Get('project')
  getProject(@GetUser('username') username: string) {
    return this.userService.getProject(username);
  }

  @Get('request')
  getRequest(@GetUser('username') username: string) {
    return this.userService.getRequest(username);
  }

  @Get('event')
  getEvent(@GetUser('username') username: string) {
    return this.userService.getEvent(username);
  }
}
