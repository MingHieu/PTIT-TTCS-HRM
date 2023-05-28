import { IsNotEmpty, IsString } from 'class-validator';

export class NotificationCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
