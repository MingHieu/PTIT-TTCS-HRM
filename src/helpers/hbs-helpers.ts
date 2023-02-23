import { ROLES } from 'src/auth/constants';
import { IPagination } from 'src/common/types';

export const hbsHelpers = {
  formatGender: function (sex) {
    switch (sex) {
      case 0:
        return 'Nam';
      case 1:
        return 'Nữ';
      case 2:
        return 'Khác';
    }
  },
  formatDate: function (date) {
    return new Date(date).toISOString().split('T')[0];
  },
  formatPagination: function (data: IPagination) {
    const { page, page_size, per_page, total } = data;
    const start = page * per_page + 1;
    const stop = start + page_size - 1;
    return `${start} - ${stop} / ${total}`;
  },
  isLastPage: function (data: IPagination) {
    const { page, page_size, per_page, total } = data;
    const start = page * per_page + 1;
    const stop = start + page_size - 1;
    return stop == total ? 'checked' : 'unchecked';
  },
  formatPosition: function (role: typeof ROLES[keyof typeof ROLES]) {
    switch (role) {
      case ROLES.HR:
        return 'Quản lý nhân sự';
      case ROLES.NV:
        return 'Nhân viên';
    }
  },
  checkSelected: function (a, b) {
    return a == b ? 'selected' : '';
  },
};
