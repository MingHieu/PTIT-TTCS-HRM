import { REQUEST_TYPE } from '../constants';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsRequestType(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          const type = Number(value);
          if (isNaN(type)) {
            return false;
          }
          for (const key in REQUEST_TYPE) {
            if (REQUEST_TYPE[key].type === type) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
