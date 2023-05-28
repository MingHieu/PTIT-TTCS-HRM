import { REQUEST_TYPE } from '../constants';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsRequestName(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          for (const key in REQUEST_TYPE) {
            if (REQUEST_TYPE[key].name === value) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
