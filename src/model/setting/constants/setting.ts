import * as moment from 'moment';

export const SETTING = {
  CHECK_IN: {
    name: 'check_in_time',
    initialValue: moment().hour(7).minute(0).format('HH:MM'),
  },
} as const;
