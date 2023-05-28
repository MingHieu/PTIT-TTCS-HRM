import { IsInt } from 'class-validator';
import { NewsCreateDto } from './news-create.dto';

export class NewsUpdateDto extends NewsCreateDto {
  @IsInt()
  id: number;
}
