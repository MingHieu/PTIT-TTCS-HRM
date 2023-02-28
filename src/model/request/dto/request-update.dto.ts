import { REQUEST_STATUS } from './../constants/request-status';
import { IsInt, IsOptional } from 'class-validator';

export class RequestUpdateDto {
  @IsInt()
  id: number;

  @IsInt()
  status: typeof REQUEST_STATUS[keyof typeof REQUEST_STATUS];
}
