import { IS_PUBLIC_KEY, PERMISSION_KEY } from '../constants';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IJwtPayload } from '../dto';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const permission = this.reflector.get<string>(
      PERMISSION_KEY,
      context.getHandler(),
    );
    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: IJwtPayload = request.user;
    return user.permissions.includes(permission);
  }
}
