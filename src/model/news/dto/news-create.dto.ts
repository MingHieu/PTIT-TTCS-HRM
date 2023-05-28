import { IsJSON, IsNotEmpty, IsString } from 'class-validator';

export class NewsCreateDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsJSON()
  @IsNotEmpty()
  content: string;
}
