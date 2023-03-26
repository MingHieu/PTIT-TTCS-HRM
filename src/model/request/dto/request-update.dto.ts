import { REQUEST_STATUS } from './../constants/request-status';
import { IsInt } from 'class-validator';
import { IsRequestStatus } from '../decorator';

export class RequestUpdateDto {
  @IsInt()
  id: number;

  @IsRequestStatus()
  status: typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];
}
