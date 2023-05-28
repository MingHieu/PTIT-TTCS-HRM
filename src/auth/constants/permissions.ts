import { ROLES } from './roles';

export const PERMISSIONS = {
  LOGIN_ADMIN: {
    name: 'login_admin',
    role: [ROLES.HR],
  },
} as const;
