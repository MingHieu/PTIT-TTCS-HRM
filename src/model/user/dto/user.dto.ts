import { MaxLength } from 'class-validator';

export class UserDto {
  @MaxLength(255)
  name: string;
}
