import { INestApplication, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { IJwtPayload, LoginDto } from './auth/dto';
import { initApi } from './helpers';

@Injectable()
export class AppService {
  api: INestApplication;
  auth: AuthService;
  constructor() {
    this.init();
  }

  async init() {
    this.api = await initApi();
    this.auth = this.api.get(AuthService);
  }

  checkLogin(user: IJwtPayload, res: Response, view, renderOptions) {
    if (user) {
      return res.redirect('/');
    }
    return res.render(view, renderOptions);
  }

  async login(body: LoginDto, res: Response) {
    try {
      const user = await this.auth.login({ ...body });
      res.cookie('jwt_token', user.token, { httpOnly: true });
      return res.redirect('/');
    } catch (e) {
      return res.redirect(`/login?error=${e}`);
    }
  }

  signOut(res: Response) {
    res.clearCookie('jwt_token');
    return res.redirect('/login');
  }
}
