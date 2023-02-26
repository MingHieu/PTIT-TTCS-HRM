import { HttpStatus } from '@nestjs/common';

export const SUCCESS_RESPONSE = {
  statusCode: HttpStatus.CREATED,
  message: 'Success',
} as const;
