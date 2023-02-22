import { ROLES } from './roles';

export const PERMISSIONS = {
  CREATE_USER: {
    name: 'create_user',
    role: [ROLES.HR],
  },
  LOGIN_ADMIN: {
    name: 'login_admin',
    role: [ROLES.HR],
  },
} as const;
