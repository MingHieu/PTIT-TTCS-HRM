import { SetMetadata } from '@nestjs/common';
import { PERMISSIONS, PERMISSION_KEY } from '../constants';

export const Permission = (
  permission: typeof PERMISSIONS[keyof typeof PERMISSIONS]['name'],
) => SetMetadata(PERMISSION_KEY, permission);
