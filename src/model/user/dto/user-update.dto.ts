import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  IsDate,
} from 'class-validator';
import { GENDERS } from '../constants';
import { IsGender } from '../decorator';
import { toDate, toInt } from 'src/helpers';

export class UserUpdateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => toInt(value))
  @IsGender()
  sex: typeof GENDERS[keyof typeof GENDERS];

  @IsPhoneNumber('VN')
  phoneNumber: string;

  @IsEmail()
  email: string;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  address: string;
}
