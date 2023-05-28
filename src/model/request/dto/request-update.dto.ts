import { REQUEST_STATUS } from './../constants/request-status';
import { IsInt } from 'class-validator';
import { IsRequestStatus } from '../decorator';
import { Transform } from 'class-transformer';
import { toInt } from 'src/helpers';

export class RequestUpdateDto {
  @IsInt()
  id: number;

  @Transform(({ value }) => toInt(value))
  @IsRequestStatus()
  status: typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];
}
