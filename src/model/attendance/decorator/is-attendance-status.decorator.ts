import { ATTENDANCE_STATUS } from '../constants';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsAttendanceStatus(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          for (const key in ATTENDANCE_STATUS) {
            if (ATTENDANCE_STATUS[key] === value) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
