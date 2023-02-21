import { Body, Controller, Get, Post } from '@nestjs/common';
import { GetUser } from 'src/auth/decorator';
import { UserDto } from './dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('update')
  update(@Body() body: UserDto, @GetUser('userId') userId) {
    return this.userService.update(body, userId);
  }

  @Get()
  get(@GetUser('userId') userId: number) {
    return this.userService.getOne(userId);
  }
}
