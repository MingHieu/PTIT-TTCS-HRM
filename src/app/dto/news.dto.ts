import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class CreateNewsDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJSON()
  @IsNotEmpty()
  content: string;
}
