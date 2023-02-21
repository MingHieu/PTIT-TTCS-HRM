import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { IJwtPayload } from '../dto';
import { Request } from 'express';

function cookieExtractor(req: Request) {
  let token = null;
  if (req && req.cookies) token = req.cookies['jwt_token'];
  return token;
}

@Injectable()
export class JwtCookieStrategy extends PassportStrategy(
  Strategy,
  'jwt-cookie',
) {
  constructor(config: ConfigService, private jwt: JwtService) {
    super({
      jwtFromRequest: cookieExtractor,
      secretOrKey: config.get('JWT_SECRET'),
      ignoreExpiration: false,
    });
  }

  validate(payload: IJwtPayload) {
    return payload;
  }
}
