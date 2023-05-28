import { PROJECT_STATUS } from '../constants';
import { ValidationOptions, registerDecorator } from 'class-validator';

export function IsProjectStatus(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          for (const key in PROJECT_STATUS) {
            if (PROJECT_STATUS[key] === value) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
