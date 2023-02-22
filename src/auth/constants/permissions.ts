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
  CHANGE_PASSWORD: {
    name: 'change_password',
    role: [ROLES.HR, ROLES.NV],
  },
} as const;
