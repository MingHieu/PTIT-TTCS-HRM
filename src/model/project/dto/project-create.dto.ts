import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { toDate } from 'src/helpers';
import { PROJECT_STATUS } from '../constants';
import { IsProjectStatus } from '../decorator';

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

  @IsProjectStatus()
  status: typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

  @IsArray()
  skills: number[];

  @IsArray()
  members: { username: string; leader?: boolean }[];
}
