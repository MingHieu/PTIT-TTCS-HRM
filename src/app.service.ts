import { INestApplication, Injectable } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dto';
import { initApi } from './helpers';

@Injectable()
export class AppService {
  api: INestApplication;

  constructor() {
    this.init();
  }

  async init() {
    this.api = await initApi();
  }

  async login(body: LoginDto, res: Response) {
    try {
      const user = await this.api.get(AuthService).login({ ...body });
      res.cookie['jwt_token'] = user.token;
      return res.redirect('/');
    } catch (e) {
      return res.redirect(`/login?error=${e}`);
    }
  }
}
