import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SignupDto, LoginDto } from './dto';
import { Public } from './decorator/public.decorator';
import { Permission } from './decorator';
import { PERMISSIONS } from './constants';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Permission(PERMISSIONS.CREATE_USER)
  @Post('signup')
  signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }
}
