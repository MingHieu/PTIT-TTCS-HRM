import { Transform } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { toDate } from 'src/helpers';

export class EventCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  from: string;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  to: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @Transform(({ value }) => toDate(value))
  @IsDate()
  expiredAt: string;
}
