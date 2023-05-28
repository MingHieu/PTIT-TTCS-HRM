import { IsInt } from 'class-validator';
import { EventCreateDto } from './event-create';

export class EventUpdateDto extends EventCreateDto {
  @IsInt()
  id: number;
}
