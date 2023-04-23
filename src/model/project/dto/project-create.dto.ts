import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { toDate, toInt } from 'src/helpers';
import { PROJECT_STATUS } from '../constants';
import { IsProjectStatus } from '../decorator';

export class ProjectCreateDto {
  @Transform(({ value }) => toDate(value))
  @IsDate()
  startAt: Date;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? undefined : toDate(value)))
  @IsDate()
  finishAt?: Date;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Transform(({ value }) => toInt(value))
  @IsProjectStatus()
  status: typeof PROJECT_STATUS[keyof typeof PROJECT_STATUS];

  @IsArray()
  skills: number[];

  @IsArray()
  members: { username: string; leader?: boolean }[];
}
