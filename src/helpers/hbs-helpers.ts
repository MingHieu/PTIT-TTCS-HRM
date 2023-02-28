import * as moment from 'moment';
import { ROLES } from 'src/auth/constants';
import { GENDERS } from 'src/common/constants';
import { IPagination } from 'src/common/types';
import { PROJECT_STATUS } from 'src/model/project/constants';
import { REQUEST_STATUS } from 'src/model/request/constants';

export const hbsHelpers = {
  formatGender: function (sex: typeof GENDERS[keyof typeof GENDERS]) {
    switch (sex) {
      case GENDERS.male:
        return 'Nam';
      case GENDERS.female:
        return 'Nữ';
      case GENDERS.other:
        return 'Khác';
    }
  },
  formatDate: function (date: Date) {
    return moment(date).format('DD/MM/yyyy');
  },
  formatDateInput: function (date: Date) {
    return moment(date).format('yyyy-MM-DD');
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
    const start = page * per_page + (total != 0 ? 1 : 0);
    const stop = start + page_size - (total != 0 ? 1 : 0);
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
  formatProjectStatus: function (
    status: typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS],
  ) {
    switch (status) {
      case 0:
        return 'Đã bàn giao';
      case 1:
        return 'Đang hoàn thiện';
      case 2:
        return 'Đã huỷ';
    }
  },
  formatRequestStatus: function (
    status: typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS],
  ) {
    switch (status) {
      case 0:
        return 'Đã duyệt';
      case 1:
        return 'Đang xử lý';
      case 2:
        return 'Từ chối';
    }
  },
  checkRequestStatus: function (
    status: typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS],
    options,
  ) {
    return status == 1 ? options.fn(this) : options.inverse(this);
  },
};
