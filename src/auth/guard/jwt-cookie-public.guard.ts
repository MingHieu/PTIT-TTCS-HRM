import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtCookiePublishGuard extends AuthGuard('jwt-cookie') {
  constructor(private reflector: Reflector) {
    super();
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    return user;
  }
}
