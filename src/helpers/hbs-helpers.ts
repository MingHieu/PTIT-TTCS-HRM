import * as moment from 'moment';
import { ROLES } from 'src/auth/constants';
import { EGender, IPagination } from 'src/common/types';

export const hbsHelpers = {
  formatGender: function (sex: EGender) {
    switch (sex) {
      case EGender.BOY:
        return 'Nam';
      case EGender.GIRL:
        return 'Nữ';
      case EGender.OTHER:
        return 'Khác';
    }
  },
  formatDate: function (date: Date) {
    return moment(date).format('DD/MM/yyyy');
  },
  formatDateTime: function (date: Date) {
    return moment(date).format('DD/MM/yyyy, hh:mm A');
  },
  formatDateDistance: function (from: Date, to: Date) {
    if (from.getDate() == to.getDate()) {
      return (
        moment(from).format('DD/MM/yyyy, HH:mm:ss') +
        ' - ' +
        moment(to).format('HH:mm:ss')
      );
    }
    return (
      moment(from).format('DD/MM/yyyy, HH:mm:ss') +
      ' - ' +
      moment(to).format('DD/MM/yyyy, HH:mm:ss')
    );
  },
  formatDateDistanceLeftFromNow: function (to: Date) {
    return moment.duration(moment(to).diff(moment(new Date()))).get('days');
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
  formatIndex: function (i) {
    return +i + 1;
  },
};
