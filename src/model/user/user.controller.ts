import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { UserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('update')
  update(@Body() body: UserDto, @GetUser('username') username) {
    return this.userService.update(body, username);
  }

  @Get()
  get(@GetUser('username') username: string) {
    return this.userService.getOne(username);
  }
}
