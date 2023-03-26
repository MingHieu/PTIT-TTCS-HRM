import { REQUEST_STATUS } from '../constants';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsRequestStatus(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          const status = Number(value);
          if (isNaN(status)) {
            return false;
          }
          for (const key in REQUEST_STATUS) {
            if (REQUEST_STATUS[key] === status) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
