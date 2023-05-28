import { IsString } from 'class-validator';
import { GetElementType, toInt } from 'src/helpers';
import { REQUEST_TYPE } from '../constants';
import { IsRequestName, IsRequestType } from '../decorator';
import { Transform } from 'class-transformer';

export class RequestCreateDto {
  @IsRequestName()
  name: GetElementType<typeof REQUEST_TYPE>['name'];

  @IsString()
  content?: string;

  @Transform(({ value }) => toInt(value))
  @IsRequestType()
  type: GetElementType<typeof REQUEST_TYPE>['type'];
}
