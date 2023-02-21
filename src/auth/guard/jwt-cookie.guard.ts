import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { IS_PUBLIC_KEY } from '../constants';
@Injectable()
export class JwtCookieGuard extends AuthGuard('jwt-cookie') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    // You can throw an exception based on either "info" or "err" arguments
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return user;
    }

    if (err || !user) {
      const res: Response = context.switchToHttp().getResponse();
      return res.redirect(`/login`);
    }
    return user;
  }
}
