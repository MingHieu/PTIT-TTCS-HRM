import { ValidationOptions, registerDecorator } from 'class-validator';
import { GENDERS } from '../constants';

export function IsGender(options?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(sex) {
          if (isNaN(sex)) {
            return false;
          }
          for (const key in GENDERS) {
            if (GENDERS[key] === sex) {
              return true;
            }
          }
          return false;
        },
      },
    });
  };
}
