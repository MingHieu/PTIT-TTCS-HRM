import { IsString } from 'class-validator';
import { GetElementType } from 'src/helpers';
import { REQUEST_TYPE } from '../constants';
import { IsRequestName, IsRequestType } from '../decorator';

export class RequestCreateDto {
  @IsRequestName()
  name: GetElementType<typeof REQUEST_TYPE>['name'];

  @IsString()
  content?: string;

  @IsRequestType()
  type: GetElementType<typeof REQUEST_TYPE>['type'];
}
