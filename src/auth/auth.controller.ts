import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto, ChangePasswordDto } from './dto';
import { Public } from './decorator/public.decorator';
import { GetUser, Permission } from './decorator';
import { UserCreateDto } from 'src/model/user/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Permission('create_user')
  @Post('signup')
  signup(@Body() body: UserCreateDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Permission('change_password')
  @Post('changePassword')
  changePassword(@GetUser() user, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(user, body);
  }
}
