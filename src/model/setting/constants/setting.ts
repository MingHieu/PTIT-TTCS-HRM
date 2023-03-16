import * as moment from 'moment';

export const SETTING = {
  CHECK_IN: {
    name: 'check_in_time',
    initialValue: moment().hour(7).minute(0).format('HH:mm'),
  },
  DAY_OFF_NUMBERS: {
    name: 'day_off_numbers',
    initialValue: '12',
  },
} as const;
