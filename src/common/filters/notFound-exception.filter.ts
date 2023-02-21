import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(NotFoundException)
export class NotFoundExceptionFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const status = exception.getStatus();

    res.status(status).render('404', {
      title: 'Không có sẵn',
      css: '404.css',
      layout: 'other',
    });
  }
}
