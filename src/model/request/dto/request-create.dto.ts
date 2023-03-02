import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { GetElementType } from 'src/helpers';
import { REQUEST_TYPE } from '../constants';

export class RequestCreateDto {
  @IsString()
  @IsNotEmpty()
  name: GetElementType<typeof REQUEST_TYPE>['name'];

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsInt()
  type: GetElementType<typeof REQUEST_TYPE>['type'];
}
