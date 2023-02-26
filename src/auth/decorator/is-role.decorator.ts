import { ValidationOptions, registerDecorator } from 'class-validator';
import { ROLES } from '../constants';

export function IsRole(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(role) {
          for (const key in ROLES) {
            if (ROLES[key] === role) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
