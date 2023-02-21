import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IJwtPayload } from '../dto';

export const GetUser = createParamDecorator(
  (key: keyof IJwtPayload, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (key) {
      return request.user[key];
    }
    return request.user;
  },
);
