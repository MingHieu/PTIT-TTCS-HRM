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
          for (const key in REQUEST_STATUS) {
            if (REQUEST_STATUS[key] === value) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
