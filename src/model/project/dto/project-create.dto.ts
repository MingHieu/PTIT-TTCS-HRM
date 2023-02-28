import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { toDate } from 'src/helpers';
import { PROJECT_STATUS } from '../constants';

export class ProjectCreateDto {
  @Transform(({ value }) => toDate(value))
  @IsDate()
  startAt: Date;

  @IsOptional()
  @Transform(({ value }) => toDate(value))
  @IsDate()
  finishAt?: Date;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  status: typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

  @IsJSON()
  content: string;

  @IsArray()
  skillId: number[];

  @IsString()
  @IsNotEmpty()
  leaderUsername: string;

  @IsArray()
  membersUsername: string[];
}
