import { ValidationOptions, registerDecorator } from 'class-validator';
import { GENDERS } from '../constants';

export function IsGender(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value) {
          for (const key in GENDERS) {
            if (GENDERS[key] === value) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
