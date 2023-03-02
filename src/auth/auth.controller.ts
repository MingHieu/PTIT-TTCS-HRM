import { AuthService } from './auth.service';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto, ChangePasswordDto } from './dto';
import { Public } from './decorator/public.decorator';
import { GetUser } from './decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('changePassword')
  changePassword(@GetUser() user, @Body() body: ChangePasswordDto) {
    return this.authService.changePassword(user, body);
  }
}
