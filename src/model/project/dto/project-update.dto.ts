import { IsInt } from 'class-validator';
import { ProjectCreateDto } from './project-create.dto';

export class ProjectUpdateDto extends ProjectCreateDto {
  @IsInt()
  id: number;
}
