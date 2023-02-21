import { SetMetadata } from '@nestjs/common';
import { PERMISSION_KEY } from '../constants';

export const Permission = (permission) =>
  SetMetadata(PERMISSION_KEY, permission);
