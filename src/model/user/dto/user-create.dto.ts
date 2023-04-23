import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsPhoneNumber,
  IsEmail,
  IsDate,
} from 'class-validator';
import { IsRole } from 'src/auth/decorator';
import { GENDERS } from 'src/model/user/constants';
import { IsGender } from 'src/model/user/decorator';
import { toDate, toInt } from 'src/helpers';

export class UserCreateDto {
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

  @Transform(({ value }) => toDate(value))
  @IsDate()
  joinAt: Date;

  @IsRole()
  role: string;
}
