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
}
